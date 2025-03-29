import { AxiosError } from "axios";
import { backendApiInstance } from "./index";
import {
  ProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  UploadProfilePhotoResponse,
} from "@/types/userTypes";

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const response = await backendApiInstance.get<ProfileResponse>(
      "/profile/me"
    );

    return response.data;
  } catch (error) {
    window.location.replace("/login");
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

/**
 * Upload profile photo (multipart/form-data)
 */
export async function uploadProfilePhoto(
  file: File
): Promise<UploadProfilePhotoResponse> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await backendApiInstance.patch<UploadProfilePhotoResponse>(
      "/profile/upload-profile-photo/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError).isAxiosError) {
      throw error;
    }
    throw new Error("Failed to upload profile photo");
  }
}

/**
 * Get profile photo URL
 */
export async function getProfilePhoto(): Promise<Blob | null> {
  try {
    const response = await backendApiInstance.get("/profile/profile-photo/", {
      responseType: "blob",
    });

    const contentType = response.headers["content-type"];
    if (contentType?.startsWith("image/")) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch profile photo", error);
    return null;
  }
}
