import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Footer, Header, Sidebar } from "@/components/Navigation";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen container mx-auto layout">
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
