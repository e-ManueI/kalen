import { handleApiError } from "./helpers";

const baseUrl = process.env.BASE_API_URL;

if (!baseUrl) {
  throw new Error("BASE_API_URL is not defined in environment variables");
}

export async function loginApi(payload: Record<string, unknown>) {
  const response = await fetch(`${baseUrl}${"/login/"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function patientSignUpApi(payload: Record<string, unknown>) {
  const response = await fetch(`${baseUrl}${"/patient-register/"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function doctorSignUpApi(payload: Record<string, unknown>) {
  const response = await fetch(`${baseUrl}${"/doctor-register/"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}
