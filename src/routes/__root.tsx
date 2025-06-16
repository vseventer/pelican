import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { NotFound } from "@/components/NotFound";

import styles from "@/styles/app.css?url";
import favicon from "@/assets/logo.png";

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
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-4">
      <NotFound />
    </div>
  ),
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}
