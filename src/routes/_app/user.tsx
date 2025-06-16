import { createFileRoute } from "@tanstack/react-router";

import { H2 } from "@/components/Typography";

export const Route = createFileRoute("/_app/user")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-2">
      <H2>Welcome back.</H2>
    </div>
  );
}
