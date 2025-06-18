import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

export const userSchema = z.object({ name: z.string().min(1) });
type UserSchema = z.infer<typeof userSchema>;

export function NewUserForm() {
  const navigate = useNavigate();

  const {
    control,
    formState: { errors, isSubmitting },
    register,
    setError,
  } = useForm<UserSchema>({
    defaultValues: { name: "" },
    resolver: zodResolver(userSchema),
  });

  return (
    <Form
      action="/api/users"
      className="space-y-2 text-sm"
      control={control}
      onSuccess={async ({ response }) => {
        const [{ id: userId }] = await response.json();
        navigate({ search: { user: userId } });
      }}
      onError={async ({ response }) => {
        const errors = await response.json();
        setError("name", errors.name);
      }}
    >
      <div className="flex flex-row gap-2">
        <input
          className="border p-1"
          placeholder="Create a new user"
          {...register("name", { setValueAs: (val) => val.trim() })}
        />
        <button disabled={isSubmitting} type="submit">
          Create
        </button>
      </div>
      {errors.name ? (
        <p className="text-red-500 text-xs">{errors.name.message}</p>
      ) : null}
    </Form>
  );
}
