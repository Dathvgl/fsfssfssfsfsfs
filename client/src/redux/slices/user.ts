import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import UserAPI from "~/apis/UserAPI";
import { UserLogin, UserProfile, UserRegister } from "~/types/mongo/userDB";
import { httpClientPrivate } from "~/utils/HttpClient";

type UserState = {
  user?: UserProfile;
  isUser?: boolean;
  error?: string;
};

const initialState: UserState = { isUser: false };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    empty: (state) => {
      state.user = undefined;
      state.isUser = false;
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = undefined;
      state.isUser = false;
      state.error = undefined;
    });
    builder.addMatcher(
      isAnyOf(register.fulfilled, login.fulfilled, getProfile.fulfilled),
      (state, action) => {
        state.user = action.payload.user;
        state.isUser = true;
        state.error = undefined;
      }
    );
    builder.addMatcher(
      isAnyOf(
        register.rejected,
        login.rejected,
        logout.rejected,
        getProfile.rejected
      ),
      (state, action) => {
        state.error = action.payload?.error;
        toast.error(action.payload?.error);
      }
    );
  },
});

export const register = createAsyncThunk<
  UserState,
  UserRegister,
  { rejectValue: UserState }
>("user/register", async (props, { rejectWithValue }) => {
  try {
    const { data } = await UserAPI.register(props);
    httpClientPrivate.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;

    const res = await UserAPI.getProfile();
    return { user: res.data };
  } catch (error) {
    const { response } = error as AxiosError;
    return rejectWithValue({ error: response?.data as string });
  }
});

export const login = createAsyncThunk<
  UserState,
  UserLogin,
  { rejectValue: UserState }
>("user/login", async (props, { rejectWithValue }) => {
  try {
    console.log("Login Redux");
    const { data } = await UserAPI.login(props);
    console.log(data);

    httpClientPrivate.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.token}`;

    const res = await UserAPI.getProfile();
    console.log(res.data);
    return { user: res.data };
  } catch (error) {
    const { response } = error as AxiosError;
    return rejectWithValue({ error: response?.data as string });
  }
});

export const logout = createAsyncThunk<
  UserState,
  unknown,
  { rejectValue: UserState }
>("user/logout", async (_, { rejectWithValue }) => {
  try {
    await UserAPI.logout();
    delete httpClientPrivate.defaults.headers.common["Authorization"];
    return {};
  } catch (error) {
    const { response } = error as AxiosError;
    return rejectWithValue({ error: response?.data as string });
  }
});

export const getProfile = createAsyncThunk<
  UserState,
  unknown,
  { rejectValue: UserState }
>("user/getProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await UserAPI.getProfile();
    return { user: res.data };
  } catch (error) {
    const { response } = error as AxiosError;
    return rejectWithValue({ error: response?.data as string });
  }
});

export const { empty } = userSlice.actions;
export const userReducer = userSlice.reducer;
