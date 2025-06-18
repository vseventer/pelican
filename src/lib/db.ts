import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";

import * as schema from "@/db/schema";

export const db: BetterSQLite3Database<typeof schema> =
  drizzle("./data/sqlite.db");
