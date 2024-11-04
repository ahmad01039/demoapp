import { Client } from "pg";

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "root",
  password: "root",
  database: "datics",
});

client.connect().catch(err => console.error("Connection error", err.stack));

export default client;
