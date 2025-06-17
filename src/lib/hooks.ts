import type { Pet, User } from "@/db/schema";
import { fetchFromApi } from "@/lib/utils";

type UserId = User["id"];

export function fetchPet(id, user?: UserId) {
  return fetchFromApi<Pet>(`/api/pets/${id}`, user);
}

export function fetchPetList(user?: UserId) {
  return fetchFromApi<Pet[]>("/api/pets", user);
}

export function fetchUser(user?: UserId) {
  return fetchFromApi<User>(`/api/users/${user}`);
}

export function fetchUserList() {
  return fetchFromApi<User[]>("/api/users");
}
