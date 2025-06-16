import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFromApi(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error("Failed to retrieve data");
  }
  return response.json();
}
