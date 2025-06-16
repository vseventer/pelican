import { createFileRoute } from "@tanstack/react-router";

import { H1 } from "@/components/Typography";
import { fetchPetList } from "@/lib/hooks";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: fetchPetList,
});

function RouteComponent() {
  return (
    <div className="space-y-2">
      <H1>Welcome back.</H1>
    </div>
  );
}
