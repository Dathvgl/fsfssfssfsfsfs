import {
  AbstractMangaFactory,
  ConstructorParams,
  MangaType,
} from "types/mangaLib";
import { Nettruyen } from "./nettruyen";
import { Toonily } from "./toonily";

export class Manga {
  constructor() {}

  build(type: MangaType, params?: ConstructorParams): AbstractMangaFactory {
    switch (type) {
      case "nettruyen": {
        return new Nettruyen(
          params !== undefined && params.baseUrl !== undefined
            ? params.baseUrl
            : "https://www.nettruyenmax.com"
        );
      }

      case "toonily": {
        return new Toonily(
          params !== undefined && params.baseUrl !== undefined
            ? params.baseUrl
            : "https://toonily.com"
        );
      }

      default: {
        return new Nettruyen("https://www.nettruyenmax.com");
      }
    }
  }
}
