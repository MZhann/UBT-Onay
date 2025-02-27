import { AxiosError } from "axios";
import { backendApiInstance } from "./index";
import {
  ProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "@/types/userTypes";

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const response = await backendApiInstance.get<ProfileResponse>(
      "/profile/me"
    );

    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch profile");
  }
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  try {
    const response = await backendApiInstance.patch<UpdateProfileResponse>(
      "/profile/update",
      payload
    );

    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to update profile");
  }
}
