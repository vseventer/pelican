import { Link as RouterLink, type LinkProps } from "@tanstack/react-router";

import { useUserId } from "@/components/UserIntercept";

export function Link({ search, ...delegated }: LinkProps) {
  const userId = useUserId();
  if (typeof search === "object" || search == null) {
    return <RouterLink search={{ user: userId, ...search }} {...delegated} />;
  }
  return <RouterLink search={search} {...delegated} />;
}
