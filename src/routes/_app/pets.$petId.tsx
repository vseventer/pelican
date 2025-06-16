import { fetchPet } from "@/lib/hooks";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/pets/$petId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return fetchPet(params.petId);
  },
});

function RouteComponent() {
  const data = useLoaderData({ from: "/_app/pets/$petId" });
  return data.animal;
}
