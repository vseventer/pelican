import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFromApi(path, user = null) {
  const qs = new URLSearchParams();
  if (user && user.id) qs.set("user", user.id);

  const response = await fetch(path + "?" + qs.toString());
  if (!response.ok) {
    throw new Error("Failed to retrieve data");
  }
  return response.json();
}
