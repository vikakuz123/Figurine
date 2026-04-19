import bcrypt from "bcryptjs";
import { Pool, type PoolClient } from "pg";

export type UserRole = "buyer" | "seller";
export type ModelType = "house" | "cat" | "chair" | "lamp" | "bunny" | "mug";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password_hash: string;
  created_at: Date | string;
};

type SellerProductRow = {
  id: string;
  seller_id: string;
  seller_name: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  accent: string;
  material: string;
  height: string;
  tags: string[];
  short_description: string;
  description: string;
  model_type: ModelType;
  created_at: Date | string;
};

type OrderRow = {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  city: string;
  address: string;
  total_amount: number;
  status: string;
  created_at: Date | string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export type SellerProductRecord = {
  id: string;
  sellerId: string;
  sellerName: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  accent: string;
  material: string;
  height: string;
  tags: string[];
  shortDescription: string;
  description: string;
  modelType: ModelType;
  createdAt: Date;
};

export type PurchaseOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  address: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: Array<{
    id: string;
    productId: string;
    productSlug: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
};

declare global {
  var __figuriumPool: Pool | undefined;
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    return null;
  }

  if (!global.__figuriumPool) {
    global.__figuriumPool = new Pool({ connectionString });
  }

  return global.__figuriumPool;
}

function mapUser(row?: UserRow | null) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash,
    createdAt: new Date(row.created_at)
  };
}

function mapSellerProduct(row: SellerProductRow): SellerProductRecord {
  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerName: row.seller_name,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    rating: Number(row.rating),
    accent: row.accent,
    material: row.material,
    height: row.height,
    tags: row.tags || [],
    shortDescription: row.short_description,
    description: row.description,
    modelType: row.model_type,
    createdAt: new Date(row.created_at)
  };
}

async function runMigrations(client: Pool | PoolClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'buyer',
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'buyer'
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS custom_products (
      id TEXT PRIMARY KEY,
      seller_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      rating NUMERIC(3, 2) NOT NULL DEFAULT 5,
      accent TEXT NOT NULL,
      material TEXT NOT NULL,
      height TEXT NOT NULL,
      tags TEXT[] NOT NULL DEFAULT '{}',
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      model_type TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      total_amount NUMERIC(10, 2) NOT NULL,
      status TEXT NOT NULL DEFAULT 'paid',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      product_slug TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price NUMERIC(10, 2) NOT NULL
    )
  `);
}

export async function initializeDatabase() {
  const pool = getPool();

  if (!pool) {
    return false;
  }

  try {
    await runMigrations(pool);
    return true;
  } catch {
    return false;
  }
}

export async function isDatabaseReady() {
  const pool = getPool();

  if (!pool) {
    return false;
  }

  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function ensureDemoUser() {
  const initialized = await initializeDatabase();

  if (!initialized) {
    return;
  }

  const existing = await getUserByEmail("demo@figuriverse.ru");
  if (existing) {
    return;
  }

  await createUser({
    id: crypto.randomUUID(),
    name: "Demo User",
    email: "demo@figuriverse.ru",
    role: "buyer",
    passwordHash: await bcrypt.hash("demo1234", 10),
    createdAt: new Date().toISOString()
  });
}

export async function getUserByEmail(email: string) {
  const pool = getPool();

  if (!pool) {
    return null;
  }

  try {
    const result = await pool.query<UserRow>("SELECT * FROM users WHERE email = $1 LIMIT 1", [
      email
    ]);
    return mapUser(result.rows[0]);
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  const pool = getPool();

  if (!pool) {
    return null;
  }

  try {
    const result = await pool.query<UserRow>("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
    return mapUser(result.rows[0]);
  } catch {
    return null;
  }
}

export async function createUser(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
}) {
  const pool = getPool();

  if (!pool) {
    return null;
  }

  try {
    const result = await pool.query<UserRow>(
      `
        INSERT INTO users (id, name, email, role, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [user.id, user.name, user.email, user.role, user.passwordHash, user.createdAt]
    );

    return mapUser(result.rows[0]);
  } catch {
    return null;
  }
}

export async function createSellerProduct(product: {
  sellerId: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  accent: string;
  material: string;
  height: string;
  tags: string[];
  shortDescription: string;
  description: string;
  modelType: ModelType;
}) {
  const pool = getPool();

  if (!pool) {
    return null;
  }

  const productId = crypto.randomUUID();

  try {
    await pool.query(
      `
        INSERT INTO custom_products (
          id, seller_id, slug, name, category, price, accent, material, height,
          tags, short_description, description, model_type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `,
      [
        productId,
        product.sellerId,
        product.slug,
        product.name,
        product.category,
        product.price,
        product.accent,
        product.material,
        product.height,
        product.tags,
        product.shortDescription,
        product.description,
        product.modelType
      ]
    );

    const result = await pool.query<SellerProductRow>(
      `
        SELECT
          cp.id,
          cp.seller_id,
          u.name AS seller_name,
          cp.slug,
          cp.name,
          cp.category,
          cp.price,
          cp.rating,
          cp.accent,
          cp.material,
          cp.height,
          cp.tags,
          cp.short_description,
          cp.description,
          cp.model_type,
          cp.created_at
        FROM custom_products cp
        JOIN users u ON u.id = cp.seller_id
        WHERE cp.id = $1
        LIMIT 1
      `,
      [productId]
    );

    const row = result.rows[0];
    return row ? mapSellerProduct(row) : null;
  } catch {
    return null;
  }
}

export async function getSellerProducts() {
  const pool = getPool();

  if (!pool) {
    return [];
  }

  try {
    const result = await pool.query<SellerProductRow>(
      `
        SELECT
          cp.id,
          cp.seller_id,
          u.name AS seller_name,
          cp.slug,
          cp.name,
          cp.category,
          cp.price,
          cp.rating,
          cp.accent,
          cp.material,
          cp.height,
          cp.tags,
          cp.short_description,
          cp.description,
          cp.model_type,
          cp.created_at
        FROM custom_products cp
        JOIN users u ON u.id = cp.seller_id
        ORDER BY cp.created_at DESC
      `
    );

    return result.rows.map(mapSellerProduct);
  } catch {
    return [];
  }
}

export async function getSellerProductsByUser(userId: string) {
  const products = await getSellerProducts();
  return products.filter((product) => product.sellerId === userId);
}

export async function createOrder(input: {
  userId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  address: string;
  items: Array<{
    productId: string;
    productSlug: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  const pool = getPool();

  if (!pool) {
    return null;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await runMigrations(client);

    const orderId = crypto.randomUUID();
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    await client.query(
      `
        INSERT INTO orders (
          id, user_id, customer_name, customer_email, phone, city, address, total_amount, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'paid')
      `,
      [
        orderId,
        input.userId,
        input.customerName,
        input.customerEmail,
        input.phone,
        input.city,
        input.address,
        totalAmount
      ]
    );

    for (const item of input.items) {
      await client.query(
        `
          INSERT INTO order_items (
            id, order_id, product_id, product_slug, product_name, quantity, unit_price
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          crypto.randomUUID(),
          orderId,
          item.productId,
          item.productSlug,
          item.productName,
          item.quantity,
          item.unitPrice
        ]
      );
    }

    await client.query("COMMIT");
    return { orderId, totalAmount };
  } catch {
    await client.query("ROLLBACK");
    return null;
  } finally {
    client.release();
  }
}

export async function getOrdersByUser(userId: string) {
  const pool = getPool();

  if (!pool) {
    return [];
  }

  try {
    const ordersResult = await pool.query<OrderRow>(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const itemsResult = await pool.query<OrderItemRow>(
      `
        SELECT oi.*
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC
      `,
      [userId]
    );

    return ordersResult.rows.map((order) => ({
      id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      phone: order.phone,
      city: order.city,
      address: order.address,
      totalAmount: Number(order.total_amount),
      status: order.status,
      createdAt: new Date(order.created_at),
      items: itemsResult.rows
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          id: item.id,
          productId: item.product_id,
          productSlug: item.product_slug,
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: Number(item.unit_price)
        }))
    })) satisfies PurchaseOrder[];
  } catch {
    return [];
  }
}

export async function hasUserPurchasedSlug(userId: string, slug: string) {
  const pool = getPool();

  if (!pool) {
    return false;
  }

  try {
    const result = await pool.query(
      `
        SELECT 1
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.user_id = $1 AND oi.product_slug = $2
        LIMIT 1
      `,
      [userId, slug]
    );

    return result.rows.length > 0;
  } catch {
    return false;
  }
}
