import "dotenv/config";

import { seed } from "drizzle-seed";

import schema from "@/db/schema";
import { db } from "@/lib/db";

seed(db, schema);
