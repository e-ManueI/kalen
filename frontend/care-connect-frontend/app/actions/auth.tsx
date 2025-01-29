"use server";
import {
  LoginFormSchema,
  LoginFormState,
  BaseSignupFormState,
  RefinedPatientSignUpFormSchema,
  RefinedDoctorSignUpFormSchema,
} from "../lib/definitions";
import { createSession, deleteSession } from "../lib/session";
import { fetchWithAuth } from "../lib/handler";
import { doctorSignUpApi, loginApi, patientSignUpApi } from "../lib/api";

// ======================== SignUps ========================
export async function doctorSignup(
  state: BaseSignupFormState,
  formData: FormData,
) {
  const validatedFields = RefinedDoctorSignUpFormSchema.safeParse({
    firstName: formData.get("doctorFirstName")?.toString(),
    lastName: formData.get("doctorLastName")?.toString(),
    email: formData.get("doctorEmail")?.toString(),
    password: formData.get("doctorPassword")?.toString(),
    retypePassword: formData.get("doctorRetypePassword")?.toString(),
    experience: formData.get("doctorExperience")
      ? parseInt(formData.get("doctorExperience")!.toString(), 10)
      : undefined,
    address: formData.get("doctorAddress")?.toString(),
  });

  console.log("validatedFields", validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for insertion to the database
  const {
    email,
    password,
    address,
    firstName: first_name,
    lastName: last_name,
    experience: experience_years,
  } = validatedFields.data;

  try {
    const response = await doctorSignUpApi({
      first_name,
      last_name,
      email,
      password,
      experience_years,
      address,
      specialization: 1,
    });

    console.log("[doctorSignUpApi] response", response);
    // Return a success state
    return {
      success: true,
      message: "Signup successful!",
    };
  } catch (error) {
    console.error("[doctorSignUpApi] Signup error:", error);

    return {
      success: false,
      message: "An error occurred during signup. Please try again.",
    };
  }
}

export async function patientSignup(
  state: BaseSignupFormState,
  formData: FormData,
) {
  const validatedFields = RefinedPatientSignUpFormSchema.safeParse({
    firstName: formData.get("patientFirstName")?.toString(),
    lastName: formData.get("patientLastName")?.toString(),
    email: formData.get("patientEmail")?.toString(),
    password: formData.get("patientPassword")?.toString(),
    retypePassword: formData.get("patientRetypePassword")?.toString(),
    dob: formData.get("patientDob")?.toString(),
    address: formData.get("patientAddress")?.toString(),
  });

  console.log("validatedFields", validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for insertion to the database
  const {
    email,
    password,
    address,
    firstName: first_name,
    lastName: last_name,
    dob: date_of_birth,
  } = validatedFields.data;

  try {
    const response = await patientSignUpApi({
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      address,
    });

    console.log("[patientSignUpApi] response", response);
    // Return a success state
    return {
      success: true,
      message: "Signup successful!",
    };
  } catch (error) {
    console.error("[patientSignUpApi] Signup error:", error);

    return {
      success: false,
      message: "An error occurred during signup. Please try again.",
    };
  }
}

// ======================== Login ========================
export async function login(state: LoginFormState, formData: FormData) {
  // Step 1: Validate form fields using Zod
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  });

  console.log("Validated Fields:", validatedFields);

  // Step 2: If validation fails, return field errors
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Step 3: Extract validated data
  const { email, password } = validatedFields.data;

  try {
    // Step 4: Call the login API
    const response = await loginApi({ email, password });

    console.log("[loginApi] Response:", response);

    // Step 5: Handle API response
    if (response) {
      try {
        // Step 6: Parse session data from the response
        const sessionData = await response;

        // Step 7: Create a session with the retrieved data
        await createSession(sessionData);

        return {
          success: true,
          message: "Login successful!",
        };
      } catch (error) {
        // Handle session creation errors
        console.error("[loginApi] Session creation error:", error);
        return {
          success: false,
          message:
            "An error occurred during session creation. Please try again.",
        };
      }
    } else {
      // Handle API response errors (e.g., invalid credentials)
      console.error("[loginApi] API response not OK:", response.statusText);
      return {
        success: false,
        message: `Invalid email or password. Please try again, ${response.statusText}`,
      };
    }
  } catch (error) {
    // Handle unexpected errors during the login process
    console.error("[loginApi] Login error:", error);
    return {
      success: false,
      message: `${error}.`,
    };
  }
}

// ======================== Logout ========================
export async function logout() {
  try {
    await fetchWithAuth("/logout/", {
      method: "POST",
    });

    // Clear the session
    await deleteSession();
  } catch (error) {
    console.error("Failed to logout:", error);
    throw new Error("Failed to logout. Please try again.");
  }
}
