import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { pets } from "@/db/schema";
import { db, userScope } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/pets").methods({
  GET: async ({ request }) => {
    const scope = new URL(request.url).searchParams.get("user");

    const data = await db
      .select()
      .from(pets)
      .where(userScope(pets.ownerId, scope));
    return json(data);
  },
});
