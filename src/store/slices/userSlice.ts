import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "@/types/userTypes";
import { getProfile, updateProfile } from "@/api/user";

// Тип состояния
interface UserState {
  name: string;
  surname: string;
  email: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  name: "",
  surname: "",
  email: "",
  loading: false,
  error: null,
};

// Получение текущего пользователя
export const getCurrentUser = createAsyncThunk<
  ProfileResponse,
  void,
  { rejectValue: string }
>("user/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const data = await getProfile();
    return data;
  } catch (error) {
    console.error(error)
    return rejectWithValue("Failed to load profile");
  }
});

// Обновление профиля
export const updateUserProfile = createAsyncThunk<
  UpdateProfileResponse,
  UpdateProfilePayload,
  { rejectValue: string }
>("user/updateUserProfile", async (payload, { rejectWithValue }) => {
  try {
    const data = await updateProfile(payload);
    return data;
  } catch (error) {
    console.error(error)
    return rejectWithValue("Failed to update profile");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.name = "";
      state.surname = "";
      state.email = "";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCurrentUser
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<ProfileResponse>) => {
        state.name = action.payload.first_name;
        state.surname = action.payload.last_name;
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })

      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<UpdateProfileResponse>) => {
        state.name = action.payload.first_name;
        state.surname = action.payload.last_name;
        state.email = action.payload.email;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
