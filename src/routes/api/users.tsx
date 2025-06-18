import { sql } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { userSchema } from "@/components/forms/User";
import { users } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/users").methods({
  GET: async () => {
    const data = await db
      .select()
      .from(users)
      .orderBy(sql`lower(${users.name})`);
    return json(data);
  },
  POST: async ({ request }) => {
    try {
      const result = userSchema.safeParse(
        Object.fromEntries(await request.formData())
      );
      if (!result.success) {
        throw new Error();
      }

      const response = await db
        .insert(users)
        .values(result.data)
        .returning({ id: users.id });
      return json(response);
    } catch {
      return new Response(
        JSON.stringify({ name: { message: "Failed to create your account." } }),
        { status: 400 }
      );
    }
  },
});
