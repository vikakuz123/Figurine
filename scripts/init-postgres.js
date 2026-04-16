const { readFileSync } = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({ connectionString });
  await client.connect();

  const schema = readFileSync(path.join(process.cwd(), "sql", "schema.sql"), "utf8");
  await client.query(schema);

  await client.end();
  console.log("PostgreSQL schema initialized.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
