import { eq } from "drizzle-orm";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { vaccineSchema } from "@/components/forms/Vaccine";
import {
  AnimalVaccine,
  animalVaccines,
  Pet,
  pets,
  vaccineRecords,
  vaccines,
} from "@/db/schema";
import { db } from "@/lib/db";

async function insertNewVaccine(
  name: string,
  petId: Pet["id"]
): Promise<AnimalVaccine["id"]> {
  // Step 1: insert new vaccine, and retrieve animalId from petId.
  const [[{ id: vaccineId }], [{ id: animalId }]] = await Promise.all([
    db.insert(vaccines).values({ name }).returning({ id: vaccines.id }),
    db.select({ id: pets.animalId }).from(pets).where(eq(pets.id, petId)),
  ]);

  // Step 2: add vaccine / animal link.
  const [{ id }] = await db
    .insert(animalVaccines)
    .values({
      vaccineId,
      animalId,
    })
    .returning({ id: animalVaccines.id });
  return id;
}

export const ServerRoute = createServerFileRoute(
  "/api/pets/$petId/vaccine"
).methods({
  DELETE: async ({ request }) => {
    console.log("deze");
    const id = new URL(request.url).searchParams.get("id");

    // NOTE:
    // - Non-administrators are not supposed to delete records, so we should add a check here.

    if (id) {
      await db
        .update(vaccineRecords)
        .set({ deletedAt: new Date() })
        .where(eq(vaccineRecords.id, parseInt(id, 10)));
    }
    return new Response(null, { status: 204 });
  },
  POST: async ({ params, request }) => {
    try {
      const petId = parseInt(params.petId);

      // NOTE:
      // - Administrators are not supposed to create new records, so we should add a check here.
      // - Also, we should verify whether the specified pet belongs to the requesting user.

      const result = vaccineSchema.safeParse(
        Object.fromEntries(await request.formData())
      );

      if (!result.success) {
        throw new Error();
      }

      // Verify whether we need to add a new vaccine.
      const { data } = result;
      const vaccine = data.name
        ? await insertNewVaccine(data.name, petId)
        : data.vaccine;

      // Next, insert vaccine.
      await db.insert(vaccineRecords).values({
        petId,
        vaccineId: vaccine,
        dateOfAdministration: new Date(data.dateOfAdministration),
      });
      return new Response(null, { status: 204 });
    } catch {
      return new Response(
        JSON.stringify({ name: { message: "Failed to add your pet." } }),
        { status: 400 }
      );
    }
  },
});
