import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";

import { useUserId } from "@/components/UserIntercept";
import { Pet } from "@/db/schema";

export const labSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["vital", "image", "finding"]),
  value: z.string().min(1),
  unit: z.string().optional(),
});
type LabSchema = z.infer<typeof labSchema>;

export function LabForm({ petId }: { petId: Pet["id"] }) {
  const router = useRouter();
  const userId = useUserId();

  const {
    control,
    formState: { errors, isSubmitting },
    register,
    reset,
    setError,
  } = useForm<LabSchema>({
    defaultValues: { name: "", category: "vital", value: "", unit: "" },
    resolver: zodResolver(labSchema),
  });

  return (
    <Form
      action={`/api/pets/${petId}/labs?user=${userId}`}
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
        <input
          className="border p-1 max-w-64"
          placeholder="Name"
          {...register("name", { setValueAs: (val) => val.trim() })}
        />
        <select className="border p-1 max-w-32" {...register("category")}>
          <option value="finding">Finding</option>
          <option value="image">Image</option>
          <option value="vital">Vital</option>
        </select>
        <input
          className="border p-1 max-w-64"
          placeholder="Value"
          {...register("value", { setValueAs: (val) => val.trim() })}
        />
        <input
          className="border p-1 max-w-64"
          placeholder="Unit (optional)"
          {...register("unit", { setValueAs: (val) => val.trim() })}
        />
        <button disabled={isSubmitting} type="submit">
          Add Lab
        </button>
      </div>
      {errors.name ? (
        <p className="text-red-500 text-xs">{errors.name.message}</p>
      ) : null}
      {errors.category ? (
        <p className="text-red-500 text-xs">{errors.category.message}</p>
      ) : null}
      {errors.value ? (
        <p className="text-red-500 text-xs">{errors.value.message}</p>
      ) : null}
      {errors.unit ? (
        <p className="text-red-500 text-xs">{errors.unit.message}</p>
      ) : null}
    </Form>
  );
}
