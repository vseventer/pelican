import { USER_ADMIN } from "./constants";
import { fetchFromApi } from "./utils";

export function fetchPet(id, user) {
  return fetchFromApi(`/api/pets/${id}`, user);
}

export function fetchPetList(user) {
  return fetchFromApi("/api/pets", user);
}

export function fetchUser(id) {
  if (id === USER_ADMIN) {
    return { name: "Administrator" };
  }
  return fetchFromApi(`/api/users/${id}`);
}

export function fetchUserList() {
  return fetchFromApi("/api/users");
}
