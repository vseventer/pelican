import { createFileRoute, Link } from "@tanstack/react-router";

import { IdCard } from "@/components/IdCard";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <IdCard>
        <ul className="text-center space-y-2">
          <li>
            <Link to="/user">
              I am a <strong>user</strong>
            </Link>
          </li>
          <li>
            <Link to="/admin">
              I am an <strong>admin</strong>
            </Link>
          </li>
        </ul>
      </IdCard>
    </div>
  );
}
