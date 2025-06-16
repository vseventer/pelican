import { eq } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { animals, pets } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/pets/$petId").methods({
  GET: async ({ params }) => {
    const data = await db
      .select({
        name: pets.name,
        animal: animals.name,
      })
      .from(pets)
      .innerJoin(animals, eq(pets.animalId, animals.id))
      .where(eq(pets.id, params.petId));
    if (data.length > 0) {
      return json(data[0]);
    }
    return new Response("Pet not found", { status: 404 });
  },
});
