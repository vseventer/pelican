import { eq, sql, type SQL } from "drizzle-orm";
import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";

import * as schema from "@/db/schema";
import { USER_ADMIN } from "@/lib/constants";

export const db: BetterSQLite3Database<typeof schema> = drizzle(
  process.env.DATABASE_URL as string
);

export function userScope(field, userId): SQL {
  if (userId === USER_ADMIN) {
    return sql`TRUE`;
  }
  return eq(field, userId);
}
