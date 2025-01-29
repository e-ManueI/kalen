import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload, SessionPayloadWithExpiry } from "./definitions";
import { cookies } from "next/dist/server/request/cookies";
import { fetchWithAuth } from "./handler";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey || secretKey.length < 32) {
  throw new Error("SESSION_SECRET must be set and at least 32 characters long");
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  if (!payload || typeof payload !== "object") {
    throw new Error("[encrypt] Payload must be a valid object");
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (!session) {
    console.log("No session token provided");
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
  }
}

export async function createSession(userData: SessionPayload): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const session: SessionPayloadWithExpiry = {
      ...userData,
      expiresAt: expiresAt,
    };

    const encryptedSession = await encrypt(session);

    const cookieStore = await cookies();

    cookieStore.set("session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
  } catch (error) {
    console.error("Failed to create session:", error);
    throw new Error("Failed to create session. Please try again.");
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function refreshToken() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    throw new Error("Session not found");
  }

  const decryptedSession = await decrypt(session.value);

  if (!decryptedSession?.refresh) {
    throw new Error("Refresh token missing");
  }

  const response = await fetchWithAuth("/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: decryptedSession.refresh }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const newSessionData = await response.json();
  await createSession(newSessionData);
  return response;
}
