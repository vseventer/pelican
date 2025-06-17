import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { H1 } from "@/components/Typography";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useLoaderData({ from: "__root__" });

  return (
    <div className="space-y-2">
      <H1>Welcome back {user.name}.</H1>
    </div>
  );
}
