import { Link as RouterLink, type LinkProps } from "@tanstack/react-router";

import { useUserId } from "@/components/UserIntercept";

export function Link({ search, ...delegated }: LinkProps) {
  const scopedSearch = { user: useUserId() };

  // If the search prop explicitly contained a user, use that.
  if (search && search !== true && "user" in search) {
    if (search.user === null) {
      // Logout.
      delete scopedSearch.user;
    } else {
      // Login.
      scopedSearch.user = search.user;
    }
  }

  return <RouterLink search={scopedSearch} {...delegated} />;
}
