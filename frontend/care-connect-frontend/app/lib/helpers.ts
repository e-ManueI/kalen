import { toast } from "@/components/hooks/use-toast";
import { BaseSignupFormState } from "./definitions";

export async function handleApiError(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    const error = await response.json();

    if (error && typeof error === "object") {
      // Handle specific error cases
      if (
        error.detail === "No active account found with the given credentials"
      ) {
        throw new Error("Invalid email or password. Please try again.");
      }

      // Handle field-specific errors
      const formattedErrors = Object.entries(error)
        .map(([field, message]) => `${field}: ${message}`)
        .join(", ");
      throw new Error(formattedErrors || "An unknown error occurred.");
    }

    throw new Error(error.message || "An error occurred.");
  } else {
    const errorText = await response.text();
    throw new Error(`Unexpected error: ${errorText}`);
  }
}

export const showToast = (state: BaseSignupFormState) => {
  if (state?.message) {
    toast({
      variant: state.success ? "default" : "destructive",
      title: state.success ? "Success" : "Uh oh! Something went wrong",
      description: state.message,
    });
  }
};
