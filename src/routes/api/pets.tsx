import { eq, sql } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { pets } from "@/db/schema";
import { USER_ADMIN } from "@/lib/constants";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/pets").methods({
  GET: async ({ request }) => {
    const scope = new URL(request.url).searchParams.get("user");

    const data = await db
      .select()
      .from(pets)
      .where(() => {
        if (scope !== USER_ADMIN) {
          return eq(pets.ownerId, scope);
        }
      });
    return json(data);
  },
});
