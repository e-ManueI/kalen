import { cookies } from "next/headers";
import { decrypt, refreshToken } from "./session";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const session = (await cookieStore).get("session");

  if (!session) {
    throw new Error("User not authenticated");
  }

  const decryptedSession = await decrypt(session.value);

  if (!decryptedSession?.access) {
    throw new Error("Invalid session token");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${decryptedSession.access}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${process.env.BASE_API_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const response = await refreshToken();
    if (!response.ok) {
      throw new Error("Unauthorized: Please log in again.");
    }
  }

  return response.json();
}
