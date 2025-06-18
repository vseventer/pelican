import { createFileRoute, redirect } from "@tanstack/react-router";

import { PetForm } from "@/components/forms/Pet";
import { H1 } from "@/components/Typography";
import { USER_ADMIN } from "@/lib/constants";
import { fetchAnimals } from "@/lib/hooks";

export const Route = createFileRoute("/pets/new")({
  component: RouteComponent,
  // Administrators cannot create new pets.
  loader: async ({ location }) => {
    const userId = location.search.user ?? null;
    if (userId === USER_ADMIN) {
      throw redirect({ to: "/" });
    }

    return fetchAnimals();
  },
});

function RouteComponent() {
  return (
    <div className="space-y-4">
      <H1>Add a New Pet</H1>
      <PetForm />
    </div>
  );
}
