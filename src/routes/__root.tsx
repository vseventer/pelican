import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import styles from "@/styles/app.css?url";
import favicon from "@/assets/logo.png";
import { Footer, Header } from "@/components/Navigation";

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
        <div className="container mx-auto layout">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
