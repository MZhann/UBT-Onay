export interface ProfileResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  score: number;
  role: string;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UpdateProfileResponse {
  _id: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  password: string;
  score: number;
}

// userTypes.ts

export interface UploadProfilePhotoResponse {
  message: string;
  photo_url: string;
}

export interface ProfilePhotoResponse {
  photo_url: string;
}
