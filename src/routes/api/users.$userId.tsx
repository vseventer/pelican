import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { users } from "@/db/schema";
import { db } from "@/lib/db";
import { USER_ADMIN } from "@/lib/constants";

export const ServerRoute = createServerFileRoute("/api/users/$userId").methods({
  GET: async ({ params }) => {
    if (params.userId === USER_ADMIN) {
      return json({ id: USER_ADMIN, name: "Administrator" });
    }

    const data = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(params.userId, 10)));

    if (data.length > 0) {
      return json(data[0]);
    }
    return new Response("Pet not found", { status: 404 });
  },
});
