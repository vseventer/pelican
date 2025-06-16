import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { users } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/users").methods({
  GET: async () => {
    const data = await db.select().from(users);
    return json(data);
  },
});
