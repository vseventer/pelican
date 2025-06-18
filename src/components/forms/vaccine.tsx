import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useRouter } from "@tanstack/react-router";

import { useUserId } from "@/components/UserIntercept";
import { Pet } from "@/db/schema";
import { TODAY } from "@/lib/constants";

export const vaccineSchema = z
  .object({
    vaccine: z.coerce.number().optional(),
    name: z.string(),
    dateOfAdministration: z.string().min(1, { message: "Please enter a date" }),
  })
  .refine((data) => !(data.vaccine === 0 && data.name.length === 0), {
    message: "Vaccine need to be specified.",
    path: ["name"],
  });
type VaccineSchema = z.infer<typeof vaccineSchema>;

export function VaccineForm({ petId }: { petId: Pet["id"] }) {
  const router = useRouter();
  const { availableVaccines } = useLoaderData({ from: "/pets/$petId" });
  const userId = useUserId();

  const {
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    setError,
  } = useForm<VaccineSchema>({
    defaultValues: { name: "", dateOfAdministration: "" },
    resolver: zodResolver(vaccineSchema),
  });

  return (
    <Form
      action={`/api/pets/${petId}/vaccine?user=${userId}`}
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
        <select className="border p-1 max-w-32" {...register("vaccine")}>
          <option />
          {availableVaccines.map((vaccine) => (
            <option key={vaccine.id} value={vaccine.id}>
              {vaccine.name}
            </option>
          ))}
        </select>
        or
        <input
          className="border p-1 max-w-64"
          placeholder="Enter a different vaccine"
          {...register("name", { setValueAs: (val) => val.trim() })}
        />
        <div className="space-x-2">
          <label htmlFor="date">Administered on:</label>
          <input
            className="border p-1 max-w-64"
            id="date"
            max={TODAY}
            type="date"
            {...register("dateOfAdministration")}
          />
        </div>
        <button disabled={isSubmitting} type="submit">
          Add Vaccine
        </button>
      </div>
      {errors.name ? (
        <p className="text-red-500 text-xs">{errors.name.message}</p>
      ) : null}
      {errors.dateOfAdministration ? (
        <p className="text-red-500 text-xs">
          {errors.dateOfAdministration.message}
        </p>
      ) : null}
    </Form>
  );
}
