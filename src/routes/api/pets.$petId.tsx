import { and, desc, eq, isNull } from "drizzle-orm";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import {
  allergies,
  allergyRecords,
  animals,
  pets,
  vaccineRecords,
  vaccines,
} from "@/db/schema";
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
      // Merge with allergies and vaccine history (executed in parallel).
      const promises = [
        db
          .select({
            id: allergyRecords.id,
            name: allergies.name,
          })
          .from(allergyRecords)
          .innerJoin(allergies, eq(allergyRecords.allergyId, allergies.id))
          .where(
            and(
              eq(allergyRecords.petId, params.petId)
              // isNull(allergyRecords.deletedAt)
            )
          )
          .orderBy(allergies.name),
        db
          .select({
            id: vaccineRecords.id,
            name: vaccines.name,
            doa: vaccineRecords.dateOfAdministration,
          })
          .from(vaccineRecords)
          .innerJoin(vaccines, eq(vaccineRecords.vaccineId, vaccines.id))
          .where(
            and(
              eq(vaccineRecords.petId, params.petId)
              // isNull(vaccineRecords.deletedAt)
            )
          )
          .orderBy(desc(vaccineRecords.dateOfAdministration)),
      ];
      const [allergyData, vaccineHistory] = await Promise.all(promises);

      return json({
        ...data[0],
        allergies: allergyData,
        vaccines: vaccineHistory,
      });
    }
    return new Response("Pet not found", { status: 404 });
  },
});
