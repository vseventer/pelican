import { createServerFileRoute } from "@tanstack/react-start/server";

import { labSchema } from "@/components/forms/Lab";
import { db } from "@/lib/db";
import { labRecords } from "@/db/schema";

export const ServerRoute = createServerFileRoute(
  "/api/pets/$petId/labs"
).methods({
  POST: async ({ params, request }) => {
    try {
      const petId = parseInt(params.petId);

      // NOTE:
      // - Administrators are not supposed to create new records, so we should add a check here.
      // - Also, we should verify whether the specified pet belongs to the requesting user.

      const result = labSchema.safeParse(
        Object.fromEntries(await request.formData())
      );

      if (!result.success) {
        throw new Error();
      }

      // Next, insert lab.
      await db.insert(labRecords).values({
        petId,
        ...result.data,
      });
      return new Response(null, { status: 204 });
    } catch (e) {
      console.log(e);
      return new Response(
        JSON.stringify({ name: { message: "Failed to add a lab." } }),
        { status: 400 }
      );
    }
  },
});
