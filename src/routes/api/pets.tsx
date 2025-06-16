import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { pets } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/pets").methods({
  GET: async () => {
    const data = await db.select().from(pets);
    return json(data);
  },
});
