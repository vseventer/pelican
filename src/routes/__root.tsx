import type { ReactNode } from "react";
import {
  createRootRoute,
  Outlet,
  HeadContent,
  Scripts,
  redirect,
} from "@tanstack/react-router";

import { NotFound } from "@/components/NotFound";
import { Footer, Header, Sidebar } from "@/components/Navigation";
import { UserIntercept } from "@/components/UserIntercept";
import { User } from "@/db/schema";
import { USER_ADMIN } from "@/lib/constants";
import { fetchUser } from "@/lib/hooks";

import styles from "@/styles/app.css?url";
import favicon from "@/assets/logo.png";

type SearchOptions = {
  user?: User["id"] | typeof USER_ADMIN;
};

export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: "stylesheet", href: styles },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: favicon,
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Pelican",
      },
    ],
  }),
  beforeLoad: ({ location, search }) => {
    if (search.user == null && location.pathname !== "/") {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ location }) => {
    const userId = location.search.user ?? null;
    if (userId !== null) {
      try {
        const user = await fetchUser(userId);
        return user;
      } catch (e) {
        throw redirect({ to: "/" });
      }
    }
  },
  // Invalidate loader cache on auth change.
  loaderDeps: ({ search }) => search.user,
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  validateSearch: (search): SearchOptions => ({
    user: search.user as SearchOptions["user"],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="overflow-y-scroll">
        <div className="min-h-screen container mx-auto layout my-2">
          <UserIntercept>
            <Header />
            <Sidebar />
            <main>{children}</main>
            <Footer />
          </UserIntercept>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
