import { createFileRoute } from "@tanstack/react-router";
import { use } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

async function fetchUsers() {
  const response = await fetch("/api/users");
  if (!response.ok) {
    return new Error("Failed to fetch users");
  }
  return response.json();
}

function RouteComponent() {
  const users = use(fetchUsers());

  return <div>{users.map((user) => user.name).join(" ")}</div>;
}
