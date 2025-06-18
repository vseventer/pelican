import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { userSchema } from "@/components/forms/User";
import { users } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/users").methods({
  GET: async () => {
    const data = await db.select().from(users);
    return json(data);
  },
  POST: async ({ request }) => {
    const result = userSchema.safeParse(
      Object.fromEntries(await request.formData())
    );
    if (!result.success) {
      return new Response(
        JSON.stringify({ name: { message: "Failed to create your account." } }),
        { status: 400 }
      );
    }

    const response = await db
      .insert(users)
      .values(result.data)
      .returning({ id: users.id });
    return json(response);
  },
});
