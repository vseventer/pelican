import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import {
  allergies,
  allergyRecords,
  animals,
  animalVaccines,
  labRecords,
  pets,
  users,
  vaccineRecords,
  vaccines,
} from "@/db/schema";
import { USER_ADMIN } from "@/lib/constants";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute("/api/pets/$petId").methods({
  GET: async ({ params, request }) => {
    const scope = new URL(request.url).searchParams.get("user") ?? USER_ADMIN;
    const petId = parseInt(params.petId);

    const data = await db
      .select({
        id: pets.id,
        name: pets.name,
        dateOfBirth: pets.dateOfBirth,
        owner: users.name,
        animalId: animals.id,
        animal: animals.name,
      })
      .from(pets)
      .innerJoin(users, eq(pets.ownerId, users.id))
      .innerJoin(animals, eq(pets.animalId, animals.id))
      .where(() => {
        const args = [eq(pets.id, petId)];
        if (scope !== USER_ADMIN) {
          args.push(eq(pets.ownerId, parseInt(scope, 10)));
        }
        return and(...args);
      });

    if (data.length > 0) {
      const pet = data[0];

      // Merge with allergies, vaccines, labs.
      const promises = [
        db
          .select({
            id: allergyRecords.id,
            name: allergies.name,
            reaction: allergyRecords.reaction,
            severity: allergyRecords.severity,
            deletedAt: allergyRecords.deletedAt,
          })
          .from(allergyRecords)
          .innerJoin(allergies, eq(allergyRecords.allergyId, allergies.id))
          .where(() => {
            const args = [eq(allergyRecords.petId, petId)];
            if (scope !== USER_ADMIN)
              args.push(isNull(allergyRecords.deletedAt));
            return and(...args);
          })
          .orderBy(sql`lower(${allergies.name})`),
        db
          .select({
            id: vaccineRecords.id,
            name: vaccines.name,
            dateOfAdministration: vaccineRecords.dateOfAdministration,
            deletedAt: vaccineRecords.deletedAt,
          })
          .from(vaccineRecords)
          .innerJoin(vaccines, eq(vaccineRecords.vaccineId, vaccines.id))
          .where(() => {
            const args = [eq(vaccineRecords.petId, petId)];
            if (scope !== USER_ADMIN)
              args.push(isNull(vaccineRecords.deletedAt));
            return and(...args);
          })
          .orderBy(desc(vaccineRecords.dateOfAdministration)),
        db
          .select({ id: allergies.id, name: allergies.name })
          .from(allergies)
          .orderBy(sql`lower(${allergies.name})`),
        db
          .select({ id: vaccines.id, name: vaccines.name })
          .from(vaccines)
          .innerJoin(animalVaccines, eq(vaccines.id, animalVaccines.vaccineId))
          .where(eq(animalVaccines.animalId, pet.animalId))
          .orderBy(sql`lower(${vaccines.name})`),
        db
          .select()
          .from(labRecords)
          .where(eq(labRecords.petId, petId))
          .orderBy(sql`lower(${labRecords.name})`),
      ];
      const [
        allergyData,
        vaccineHistory,
        availableAllergies,
        availableVaccines,
        labs,
      ] = await Promise.all(promises);

      return json({
        ...pet,
        allergies: allergyData,
        labs,
        vaccines: vaccineHistory,
        availableAllergies,
        availableVaccines,
      });
    }
    return new Response("Pet not found", { status: 404 });
  },
});
