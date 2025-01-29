import { profileFormSchema, UserData } from "../lib/definitions";
import { fetchWithAuth } from "../lib/handler";
import { getUserRole } from "./user";

export async function updateUserProfile(data: UserData) {
  // Validate the input using Zod
  const validatedData = profileFormSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error("Invalid data");
  }

  const url =
    (await getUserRole()) === "patient"
      ? `/patient-update/${data.userId}`
      : `/doctor-update/${data.userId}`;
  try {
    const response = await fetchWithAuth(url, {
      method: "POST",
      body: JSON.stringify(validatedData.data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    console.log("[updateUserProfile] ", await response.json());

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
