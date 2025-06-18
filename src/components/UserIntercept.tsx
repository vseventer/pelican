import { type ReactNode, Suspense, use } from "react";
import { Navigate, useLoaderData } from "@tanstack/react-router";

import { NewUserForm } from "@/components/forms/User";
import { IdCard } from "@/components/IdCard";
import { Link } from "@/components/Link";
import { H2 } from "@/components/Typography";
import { fetchUserList } from "@/lib/hooks";
import { User } from "@/db/schema";

export function useUserId(): User["id"] | null {
  return useLoaderData({ from: "__root__" })?.id ?? null;
}

function UserList({ promise }: { promise: Promise<User[]> }) {
  const users = use(promise);

  const inner =
    users.length > 0 ? (
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id}>
            <Link search={{ user: user.id }} to="/">
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <aside className="space-y-4">
      <H2>Who are you?</H2>
      {inner}
      <NewUserForm />
      <hr />
      <Link search={{ user: "admin" }}>Administrator</Link>
    </aside>
  );
}

function SelectUser() {
  return (
    <>
      <IdCard />
      <Suspense fallback="Loading...">
        <UserList promise={fetchUserList()} />
      </Suspense>
    </>
  );
}

export function UserIntercept({ children }: { children: ReactNode }) {
  const userId = useUserId();
  if (userId === null) {
    return (
      <>
        <Navigate to="/" />
        <SelectUser />
      </>
    );
  }
  return children;
}
