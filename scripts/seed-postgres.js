const { Client } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const email = "demo@figuriverse.ru";
  const existing = await client.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);

  if (!existing.rows.length) {
    await client.query(
      `
        INSERT INTO users (id, name, email, password_hash, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [
        crypto.randomUUID(),
        "Demo User",
        email,
        await bcrypt.hash("demo1234", 10),
        new Date().toISOString()
      ]
    );
  }

  await client.end();
  console.log("Demo user is ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
