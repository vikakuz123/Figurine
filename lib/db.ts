import bcrypt from "bcryptjs";
import { Pool } from "pg";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date | string;
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
    global.__figuriumPool = new Pool({
      connectionString
    });
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
    passwordHash: row.password_hash,
    createdAt: new Date(row.created_at)
  };
}

export async function initializeDatabase() {
  const pool = getPool();

  if (!pool) {
    return false;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } catch {
    return false;
  }

  return true;
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
        INSERT INTO users (id, name, email, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [user.id, user.name, user.email, user.passwordHash, user.createdAt]
    );

    return mapUser(result.rows[0]);
  } catch {
    return null;
  }
}
