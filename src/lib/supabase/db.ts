import { drizzle } from "drizzle-orm/postgres-js";
import  postgres  from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log(" Could not find database url in .env file (db.ts)");
}

const client = postgres(process.env.DATABASE_URL as string , {max: 1});
const db = drizzle(client, schema);
const migrateDb = async () => {

    try {

        console.log("Migrating database...");
        await migrate(db, { migrationsFolder : "migrations"})
        console.log("Database migration complete");
        
    } catch (error) {
        console.log("Error migrating database", error);
    }
};
migrateDb();
export default db;