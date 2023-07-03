import {
  UserLogin,
  UserPerson,
  UserProfile,
  UserRegister,
  UserToken,
  UserUpdate,
} from "~/types/mongo/userDB";
import { httpClient, httpClientPrivate } from "~/utils/HttpClient";

abstract class UserAPI {
  static userPerson(id: string) {
    return httpClient.get<UserPerson>(`api/user/userPerson/${id}`);
  }

  static register(data: UserRegister) {
    return httpClient.post<UserToken>(
      "api/user/register",
      { ...data },
      { withCredentials: true }
    );
  }

  static login(data: UserLogin) {
    return httpClient.post<UserToken>(
      "api/user/login",
      { ...data },
      { withCredentials: true }
    );
  }

  static logout() {
    return httpClientPrivate.post("api/user/logout");
  }

  static refresh() {
    return httpClient.post<UserToken>(
      "api/user/refresh",
      {},
      { withCredentials: true }
    );
  }

  static getProfile() {
    return httpClientPrivate.get<UserProfile>("api/user/profile");
  }

  static putProfile(data: UserUpdate) {
    return httpClientPrivate.put<UserProfile>("api/user/profile", { ...data });
  }
}

export default UserAPI;
