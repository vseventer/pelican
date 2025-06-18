import { eq } from "drizzle-orm";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { allergySchema } from "@/components/forms/Allergy";
import { allergies, allergyRecords } from "@/db/schema";
import { db } from "@/lib/db";

export const ServerRoute = createServerFileRoute(
  "/api/pets/$petId/allergy"
).methods({
  DELETE: async ({ request }) => {
    const id = new URL(request.url).searchParams.get("id");

    // NOTE:
    // - Non-administrators are not supposed to delete records, so we should add a check here.

    if (id) {
      await db
        .update(allergyRecords)
        .set({ deletedAt: new Date() })
        .where(eq(allergyRecords.id, parseInt(id, 10)));
    }
    return new Response(null, { status: 204 });
  },
  POST: async ({ params, request }) => {
    try {
      const petId = parseInt(params.petId);

      // NOTE:
      // - Administrators are not supposed to create new records, so we should add a check here.
      // - Also, we should verify whether the specified pet belongs to the requesting user.

      const result = allergySchema.safeParse(
        Object.fromEntries(await request.formData())
      );

      if (!result.success) {
        throw new Error();
      }

      // Verify whether we need to add a new vaccine.
      const { data } = result;
      const allergyId = data.name
        ? (
            await db
              .insert(allergies)
              .values({ name: data.name })
              .returning({ id: allergies.id })
          )[0].id
        : data.allergy;

      // Next, insert vaccine.
      await db.insert(allergyRecords).values({
        petId,
        allergyId,
        reaction: data.reaction,
        severity: data.severity,
      });
      return new Response(null, { status: 204 });
    } catch {
      return new Response(
        JSON.stringify({ name: { message: "Failed to add an allergy." } }),
        { status: 400 }
      );
    }
  },
});
