import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";
import UserAPI from "~/apis/UserAPI";
import { envs } from "./Enviroments";
import { store } from "~/redux/store";
import { empty, getProfile } from "~/redux/slices/user";
import MusicAPI from "~/apis/MusicAPI";

class HttpClient {
  instance: AxiosInstance;

  constructor(baseUrl?: string) {
    this.instance = axios.create({
      baseURL: baseUrl ?? envs.NODE_SERVER,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const httpClient = new HttpClient().instance;
export const httpClientPrivate = new HttpClient().instance;

httpClientPrivate.defaults.withCredentials = true;
httpClientPrivate.interceptors.response.use(
  (res) => res,
  async () => {
    try {
      const { data } = await UserAPI.refresh();
      httpClientPrivate.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;
      toast.info("Refresh token");
      store.dispatch(getProfile({}));
    } catch (error) {
      const { response } = error as AxiosError;
      toast.error(response?.data as string);
      store.dispatch(empty());
      // window.location.href = "/"
    }
  }
);

export const httpClientMusic = new HttpClient().instance;

httpClientMusic.interceptors.response.use(
  (res) => res,
  async () => {
    try {
      const { data } = await MusicAPI.refresh();
      httpClientMusic.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.access_token}`;
    } catch (error) {
      const { response } = error as AxiosError;
      toast.error(response?.data as string);
    }
  }
);
