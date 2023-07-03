import { CoverInfo } from "~/types/mongo/cover";
import { httpClient } from "~/utils/HttpClient";

abstract class CoverAPI {
  static getCover(id: string) {
    return httpClient.get<CoverInfo>(`api/cover/getCover/${id}`);
  }
}

export default CoverAPI;
