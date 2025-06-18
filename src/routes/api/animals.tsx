import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { animals } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/animals").methods({
  GET: async () => {
    const data = await db.select().from(animals).orderBy(animals.name);
    return json(data);
  },
});
