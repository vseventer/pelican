import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { users } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/users/$userId").methods({
  GET: async ({ params }) => {
    const data = await db
      .select()
      .from(users)
      .where(eq(users.id, params.userId));

    if (data.length > 0) {
      return json(data[0]);
    }
    return new Response("Pet not found", { status: 404 });
  },
});
