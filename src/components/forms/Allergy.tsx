import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useRouter } from "@tanstack/react-router";

import { useUserId } from "@/components/UserIntercept";
import { AllergyRecord, Pet } from "@/db/schema";
import { USER_ADMIN } from "@/lib/constants";

export const allergySchema = z
  .object({
    allergy: z.coerce.number().optional(),
    name: z.string(),
    reaction: z.string().optional(),
    severity: z.enum(["mild", "severe"]),
  })
  .refine((data) => !(data.allergy === 0 && data.name.length === 0), {
    message: "Allergy needs to be specified.",
    path: ["name"],
  });
type AllergySchema = z.infer<typeof allergySchema>;

export function DeleteForm({
  allergy,
  petId,
}: {
  allergy: AllergyRecord;
  petId: Pet["id"];
}) {
  const router = useRouter();
  const userId = useUserId();
  const {
    control,
    formState: { isSubmitting },
  } = useForm();

  return userId === USER_ADMIN && allergy.deletedAt === null ? (
    <Form
      action={`/api/pets/${petId}/allergy?id=${allergy.id}`}
      control={control}
      method="delete"
      onSuccess={() => router.invalidate()}
    >
      <button disabled={isSubmitting} type="submit">
        Delete
      </button>
    </Form>
  ) : null;
}

export function AllergyForm({ petId }: { petId: Pet["id"] }) {
  const router = useRouter();
  const { availableAllergies } = useLoaderData({ from: "/pets/$petId" });
  const userId = useUserId();

  const {
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    setError,
  } = useForm<AllergySchema>({
    defaultValues: { name: "", reaction: "", severity: "mild" },
    resolver: zodResolver(allergySchema),
  });

  return (
    <Form
      action={`/api/pets/${petId}/allergy?user=${userId}`}
      className="space-y-2"
      control={control}
      onSuccess={() => {
        reset();
        router.invalidate();
      }}
      onError={async ({ response }) => {
        const errors = await response.json();
        setError("name", errors.name);
      }}
    >
      <div className="flex flex-row flex-wrap gap-4 items-center text-sm">
        <select className="border p-1 max-w-32" {...register("allergy")}>
          <option />
          {availableAllergies.map((allergy) => (
            <option key={allergy.id} value={allergy.id}>
              {allergy.name}
            </option>
          ))}
        </select>
        or
        <input
          className="border p-1 max-w-64"
          placeholder="Enter a different allergy"
          {...register("name", { setValueAs: (val) => val.trim() })}
        />
        <input
          className="border p-1 max-w-64"
          placeholder="Reaction (optional)"
          {...register("reaction", { setValueAs: (val) => val.trim() })}
        />
        <select className="border p-1 max-w-32" {...register("severity")}>
          <option value="mild">Mild</option>
          <option value="severe">Severe</option>
        </select>
        <button disabled={isSubmitting} type="submit">
          Add Allergy
        </button>
      </div>
      {errors.name ? (
        <p className="text-red-500 text-xs">{errors.name.message}</p>
      ) : null}
      {errors.reaction ? (
        <p className="text-red-500 text-xs">{errors.reaction.message}</p>
      ) : null}
      {errors.severity ? (
        <p className="text-red-500 text-xs">{errors.severity.message}</p>
      ) : null}
    </Form>
  );
}
