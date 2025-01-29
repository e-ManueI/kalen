import { cookies } from "next/headers";
import { decrypt } from "../lib/session";
import { SessionPayload, SessionPayloadWithExpiry } from "../lib/definitions";

export async function getUserDataFromSession() {
  // Retrieve the session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    console.log("No session found in cookies.");
    return null;
  }

  // Decrypt the session
  const decryptedSession = await decrypt(session);

  if (!decryptedSession) {
    console.log("Failed to decrypt session.");
    return null;
  }

  // Extract user data
  const {
    id: userId,
    email,
    first_name: firstName = "Unknown",
    last_name: lastName = "Unknown",
    phone_number: phoneNumber = "N/A",
  } = decryptedSession as SessionPayloadWithExpiry;

  return {
    userId,
    email,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    phoneNumber,
  };
}

export async function getUserRole() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    console.log("No session found in cookies.");
    return null;
  }
  const decryptedSession = await decrypt(session);
  if (!decryptedSession) {
    console.log("Failed to decrypt session.");
    return null;
  }
  const { user_type: userType } = decryptedSession as SessionPayload;
  if (!userType) {
    console.log("Required user type missing in session.");
    return null;
  }
  return userType;
}
