import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { Manga } from "models/mangaLib/manga";
import { Genre, MangaType } from "types/mangaLib";
import { numCheckUd, strCheck, strCheckUd } from "utils/check";

const mangaTypes: MangaType[] = ["nettruyen", "toonily"];

function typeCheck(str: unknown) {
  if (typeof str != "string") throw new CustomError("Type manga invalid", 500);
  const check = mangaTypes.includes(str as MangaType);
  if (!check) throw new CustomError("Type manga not exist", 500);
  return str as MangaType;
}

function genreCheck(unk: unknown) {
  const genre: Genre = unk as Genre;
  if (!genre.name || !genre.path)
    throw new CustomError("Genre manga invalid", 500);
  return genre;
}

export abstract class MangaLibController {
  static genres(req: Request, res: Response) {
    const { type } = req.query;

    const mangaType = typeCheck(type);
    const manga = new Manga().build(mangaType);
    res.status(200).json(manga.all_genres);
  }

  static async lastest(req: Request, res: Response) {
    const { type, page } = req.query;

    const mangaType = typeCheck(type);
    const mangaPage = numCheckUd(page);

    const manga = new Manga().build(mangaType);
    const data = await manga.getListLatestUpdate(mangaPage);
    res.status(200).json(data);
  }

  static async search(req: Request, res: Response) {
    const { type, title, page } = req.query;

    const mangaType = typeCheck(type);
    const mangaTitle = strCheck(title);
    const mangaPage = numCheckUd(page);

    const manga = new Manga().build(mangaType);
    const data = await manga.search(mangaTitle, mangaPage);
    res.status(200).json(data);
  }

  static async genreList(req: Request, res: Response) {
    const { type, page, genre } = req.query;

    const mangaType = typeCheck(type);
    const mangaPage = numCheckUd(page);
    const mangeGenre = genreCheck(genre);

    const manga = new Manga().build(mangaType);
    const data = await manga.getListByGenre(mangeGenre, mangaPage);
    res.status(200).json(data);
  }

  static async manga(req: Request, res: Response) {
    const { type, url } = req.query;

    const mangaType = typeCheck(type);
    const mangaUrl = strCheck(url);

    const manga = new Manga().build(mangaType);
    const data = await manga.getDetailManga(mangaUrl);
    res.status(200).json(data);
  }

  static async chapter(req: Request, res: Response) {
    const { type, urlChapter, url, path } = req.query;

    const mangaType = typeCheck(type);
    const mangaUrlChapter = strCheck(urlChapter);
    const mangaUrl = strCheckUd(url);
    const mangaPath = strCheckUd(path);

    const manga = new Manga().build(mangaType);
    const data = await manga.getDataChapter(
      mangaUrlChapter,
      mangaUrl,
      mangaPath
    );

    res.status(200).json(data);
  }
}
