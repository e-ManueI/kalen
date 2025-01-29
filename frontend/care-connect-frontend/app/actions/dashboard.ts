import { fetchWithAuth } from "../lib/handler";

export async function fetchDashboardData() {
  try {
    const url = `/dashboard`;
    const response = await fetchWithAuth(url, {
      method: "GET",
    });

    // Parse the response as JSON
    const data = await response;
    console.log("[fetchDashboardData] ", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error("Failed to fetch dashboard data. Please try again.");
  }
}
