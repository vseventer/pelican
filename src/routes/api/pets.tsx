import { eq, sql } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { animals, pets } from "@/db/schema";
import { USER_ADMIN } from "@/lib/constants";
import { db } from "@/lib/db";
import { petSchema } from "@/components/forms/Pet";

export const ServerRoute = createServerFileRoute("/api/pets").methods({
  GET: async ({ request }) => {
    const scope = new URL(request.url).searchParams.get("user") ?? USER_ADMIN;

    const data = await db
      .select()
      .from(pets)
      .where(() => {
        if (scope !== USER_ADMIN) {
          return eq(pets.ownerId, parseInt(scope, 10));
        }
      })
      .orderBy(sql`lower(${pets.name})`);
    return json(data);
  },
  POST: async ({ request }) => {
    try {
      const scope = new URL(request.url).searchParams.get("user") ?? USER_ADMIN;

      // NOTE: Administrators are not supposed to create new pets, so we should add a check here.

      const result = petSchema.safeParse(
        Object.fromEntries(await request.formData())
      );

      if (!result.success) {
        throw new Error();
      }

      // Verify whether we need to add a new animal species.
      const { data } = result;
      const animalId = data.customAnimal
        ? (
            await db
              .insert(animals)
              .values({ name: data.customAnimal })
              .returning({ id: animals.id })
          )[0].id
        : data.animal;
      console.log(scope, animalId);
      // Next, insert pet.
      const response = await db
        .insert(pets)
        .values({
          name: data.name,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          ownerId: scope,
          animalId,
        })
        .returning({ id: pets.id });
      return json(response);
    } catch {
      return new Response(
        JSON.stringify({ name: { message: "Failed to add your pet." } }),
        { status: 400 }
      );
    }
  },
});
