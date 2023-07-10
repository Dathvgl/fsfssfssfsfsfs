import { Request, Response } from "express";
import { CustomError } from "models/errror";
import { ZingMp3 } from "zingmp3-api-full";

export abstract class ZingMP3Controller {
  static async song(req: Request, res: Response) {
    const { id } = req.params;
    const data = await ZingMp3.getSong(id).catch(() => {
      throw new CustomError("Error zing mp3 song", 500);
    });

    res.status(200).json(data);
  }

  static async detailPlaylist(req: Request, res: Response) {
    const { id } = req.params;

    ZingMp3.getDetailPlaylist(id)
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        throw new CustomError("Error zing mp3 detail playlist", 500);
      });

    res.send("Zing MP3");
  }

  static async home(req: Request, res: Response) {
    const data = await ZingMp3.getHome().catch(() => {
      throw new CustomError("Error zing mp3 home", 500);
    });

    res.status(200).json(data);
  }

  static async top100(req: Request, res: Response) {
    const data = await ZingMp3.getTop100().catch(() => {
      throw new CustomError("Error zing mp3 top 100", 500);
    });
    res.status(200).json(data);
  }

  static async chartHome(req: Request, res: Response) {
    const data = await ZingMp3.getChartHome().catch(() => {
      throw new CustomError("Error zing mp3 chart home", 500);
    });

    res.status(200).json(data);
  }

  static async newRelease(req: Request, res: Response) {
    ZingMp3.getNewReleaseChart()
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        throw new CustomError("Error zing mp3 new release", 500);
      });

    res.send("Zing MP3");
  }

  static async infoSong(req: Request, res: Response) {
    const { id } = req.params;
    const data = await ZingMp3.getInfoSong(id).catch(() => {
      throw new CustomError("Error zing mp3 info song", 500);
    });

    res.status(200).json(data);
  }

  static async artist(req: Request, res: Response) {
    const { id } = req.params;

    const data = await ZingMp3.getArtist("sontungmtp").catch(() => {
      throw new CustomError("Error zing mp3 artist", 500);
    });

    res.status(200).json(data);
  }

  static async listArtistSong(req: Request, res: Response) {
    const { id } = req.params;

    ZingMp3.getListArtistSong("IWZ9ZD8A", "1", "15")
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        throw new CustomError("Error zing mp3 list artist song", 500);
      });

    res.send("Zing MP3");
  }

  static async lyris(req: Request, res: Response) {
    const { id } = req.params;

    ZingMp3.getLyric("ZOACFBBU")
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        throw new CustomError("Error zing mp3 lyric", 500);
      });

    res.send("Zing MP3");
  }

  static async search(req: Request, res: Response) {
    const { name } = req.params;
    const data = await ZingMp3.search(name).catch(() => {
      throw new CustomError("Error zing mp3 search", 500);
    });

    res.status(200).json(data);
  }

  static async listMv(req: Request, res: Response) {
    const { id } = req.params;

    ZingMp3.getListMV("IWZ9Z08I", "1", "15")
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        throw new CustomError("Error zing mp3 list mv", 500);
      });

    res.send("Zing MP3");
  }

  static async categoryMv(req: Request, res: Response) {
    const { id } = req.params;

    ZingMp3.getCategoryMV("IWZ9Z08I")
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        throw new CustomError("Error zing mp3 category mv", 500);
      });

    res.send("Zing MP3");
  }

  static async video(req: Request, res: Response) {
    const { id } = req.params;

    ZingMp3.getVideo("ZWEW9WI8")
      .then((data) => {
        console.log(data);
      })
      .catch(() => {
        throw new CustomError("Error zing mp3 video", 500);
      });

    res.send("Zing MP3");
  }
}
