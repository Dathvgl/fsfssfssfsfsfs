import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "react-toastify";
import UserAPI from "~/apis/UserAPI";
import { empty, getProfile } from "~/redux/slices/user";
import { store } from "~/redux/store";
import { envs } from "./Enviroments";

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
