import { fetchFromApi } from "./utils";

export function fetchPet(id) {
  return fetchFromApi(`/api/pets/${id}`);
}

export function fetchPetList() {
  return fetchFromApi("/api/pets");
}
