import { AxiosError } from "axios";
import { backendApiInstance } from "./index";
import { LeaderboardMeResponse } from "@/types/leaderboardTypes";

export async function getMyLeaderboardInfo(): Promise<LeaderboardMeResponse> {
  try {
    const response = await backendApiInstance.get<LeaderboardMeResponse>(
      "/profile/leaderboard/me"
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch leaderboard info");
  }
}
