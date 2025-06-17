import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { User } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFromApi<T>(
  path: string,
  userId: User["id"] | null = null
): Promise<T> {
  const qs = new URLSearchParams();
  if (userId !== null) {
    qs.set("user", String(userId));
  }

  const response = await fetch(path + "?" + qs.toString());
  if (!response.ok) {
    throw new Error("Failed to retrieve data");
  }
  return response.json();
}
