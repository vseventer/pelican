import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData, useNavigate } from "@tanstack/react-router";

import { useUserId } from "@/components/UserIntercept";
import { TODAY } from "@/lib/constants";

export const petSchema = z
  .object({
    name: z.string().min(1),
    dateOfBirth: z.string(),
    animal: z.coerce.number().optional(),
    customAnimal: z.string(),
  })
  .refine((data) => !(data.animal === 0 && data.customAnimal.length === 0), {
    message: "Species need to be specified.",
    path: ["animal"],
  });
type PetSchema = z.infer<typeof petSchema>;

export function PetForm() {
  const navigate = useNavigate();
  const animals = useLoaderData({ from: "/pets/new" });
  const userId = useUserId();

  const {
    control,
    formState: { errors, isSubmitting },
    register,
    setError,
  } = useForm<PetSchema>({
    defaultValues: { name: "", dateOfBirth: "" },
    resolver: zodResolver(petSchema),
  });

  return (
    <Form
      action={`/api/pets?user=${userId}`}
      className="space-y-4 text-sm"
      control={control}
      onSuccess={async ({ response }) => {
        const [{ id: petId }] = await response.json();
        navigate({
          to: "/pets/$petId",
          params: { petId },
          search: { user: userId },
        });
      }}
      onError={async ({ response }) => {
        const errors = await response.json();
        setError("name", errors.name);
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="pet-name">Name</label>
        <input
          className="border p-1 max-w-64"
          id="pet-name"
          placeholder="Name"
          {...register("name", { setValueAs: (val) => val.trim() })}
        />

        {errors.name ? (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="pet-dob">Date of Birth (optional)</label>
        <input
          className="border p-1 max-w-32"
          id="pet-dob"
          type="date"
          max={TODAY}
          {...register("dateOfBirth")}
        />
        {errors.dateOfBirth ? (
          <p className="text-red-500 text-xs">{errors.dateOfBirth.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="pet-animal">Species</label>
        <div className="flex flex-row gap-2 items-center">
          <select className="border p-1 max-w-32" {...register("animal")}>
            <option />
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
          or
          <input
            className="border p-1 max-w-64"
            id="pet-animal"
            placeholder="Enter a different species"
            {...register("customAnimal", { setValueAs: (val) => val.trim() })}
          />
        </div>
        {errors.animal ? (
          <p className="text-red-500 text-xs">{errors.animal.message}</p>
        ) : null}
      </div>
      <button disabled={isSubmitting} type="submit">
        Create
      </button>
    </Form>
  );
}
