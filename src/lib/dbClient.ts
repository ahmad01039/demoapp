import { Client } from "pg";

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, 
  },
});

client.connect().catch(err => console.error("Connection error", err.stack));

export default client;
