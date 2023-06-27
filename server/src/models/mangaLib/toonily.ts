import axios from "axios";
import * as cheerio from "cheerio";
import {
  NETTRUYEN_SORT_FILTER,
  NETTRUYEN_STATUS_FILTER,
} from "manga-lib/dist/src/constants/filter";
import {
  AbstractMangaFactory,
  Chapter,
  Genre,
  ImageChapter,
  ResponseChapter,
  ResponseDetailManga,
  ResponseListManga,
} from "types/mangaLib";

export class Toonily implements AbstractMangaFactory {
  baseUrl: string;
  all_genres: Genre[];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.all_genres = [] as Genre[];
  }

  async getListLatestUpdate(
    page?: number | undefined
  ): Promise<ResponseListManga> {
    const axios_get = await axios.get(
      `${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`
    );
    const $ = cheerio.load(axios_get.data);
    const wrap_items = $("#loop-content > div > div > div");

    const data: {
      _id: number;
      title: string;
      image_thumbnail: string;
      href: string;
    }[] = [];
    wrap_items.each((i, e) => {
      data.push({
        _id: i,
        title: $(e)
          .find("div.item-summary > div.post-title.font-title > h3 > a")
          .text(),
        image_thumbnail: $(e)
          .find("div.item-thumb.c-image-hover > a > img")
          .attr("data-src")!,
        href: $(e)
          .find("div.item-summary > div.post-title.font-title > h3 > a")
          .attr("href")!,
      });
    });

    const last_page = $("div.wp-pagenavi").find("a.last").attr("href")!;

    const totalPage = Number(
      last_page !== undefined
        ? last_page
            .substring(0, last_page.length - 1)
            .split("/")
            .at(-1)
        : page !== undefined
        ? page
        : 1
    );

    return {
      data,
      totalData: data.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext: page !== undefined ? page < totalPage : 1 < totalPage,
      canPrev: page !== undefined ? page > 1 : false,
    };
  }
  async getDetailManga(url: string): Promise<ResponseDetailManga> {
    const $ = cheerio.load((await axios.get(url)).data);

    const site_content = $("div.site-content");

    const path = url.substring(this.baseUrl.length);
    const author = site_content
      .find("div.summary-content > div.author-content > a")
      .text();
    const title = site_content
      .find("div.post-content > div.post-title > h1")
      .text()
      .trim();
    const status = site_content
      .find("div.post-status > div.post-content_item > div.summary-content")
      .text()
      .trim();
    const genres: Genre[] = [] as Genre[];
    $("div.genres-content > a").each((_i, e) => {
      genres.push({
        url: $(e).attr("href")!,
        name: $(e).text(),
        path: $(e).attr("href")!.substring(this.baseUrl.length),
      });
    });

    const views = site_content
      .find(
        "div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(5) > div.summary-content"
      )
      .text()
      .split("views")[0]
      .trim()
      .split(" ")
      .at(-1)!;

    const rate = site_content.find("#averagerate").text().trim();
    const rate_number = site_content.find("#countrate").text();
    const follows = site_content
      .find(
        "div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div.manga-action > div.add-bookmark > div.action_detail > span"
      )
      .text()
      .split(" ")[0];

    const chapters: Chapter[] = [] as Chapter[];
    site_content
      .find("ul.main.version-chap.no-volumn > li.wp-manga-chapter")
      .each((i, e) => {
        chapters.push({
          url: $(e).find("a").attr("href")!,
          path: $(e).find("a").attr("href")!.substring(this.baseUrl.length),
          parent_href: url,
          title: $(e).find("a").text().trim(),
        });
      });

    const image_thumbnail = site_content.find("img").attr("data-src")!;

    const description = site_content
      .find("div.summary__content > p")
      .text()
      .trim();

    return {
      image_thumbnail,
      description,
      path,
      url,
      author,
      genres,
      rate,
      rate_number,
      follows,
      views,
      title,
      status,
      chapters,
    };
  }
  async getDataChapter(
    url_chapter: string,
    url?: string | undefined,
    path?: string | undefined,
    prev_chapter?: Chapter | undefined,
    next_chapter?: Chapter | undefined
  ): Promise<ResponseChapter> {
    const $ = cheerio.load((await axios.get(url_chapter)).data);

    const site_content = $("div.main-col-inner");
    const title = site_content
      .find("ol.breadcrumb > li:nth-child(3)")
      .text()
      .trim();

    const chapter_data: ImageChapter[] = [] as ImageChapter[];
    site_content
      .find("div.entry-content div.reading-content > div.page-break > img")
      .each((i, e) => {
        chapter_data.push({
          _id: i,
          src_origin: $(e).attr("data-src")!.trim(),
          alt: $(e).attr("alt")!,
        });
      });

    const parent_href = site_content
      .find("ol.breadcrumb > li:nth-child(3) > a")
      .attr("href")!;

    const next_chapter_data: Chapter | null = site_content.find(
      "div.nav-links > div.nav-next > a"
    ).length
      ? {
          url: site_content
            .find("div.nav-links > div.nav-next > a")
            .attr("href")!,
          path: site_content
            .find("div.nav-links > div.nav-next > a")
            .attr("href")!
            .substring(this.baseUrl.length),
          parent_href: parent_href,
          title,
        }
      : null;

    const prev_chapter_data: Chapter | null = site_content.find(
      "div.nav-links > div.nav-previous > a"
    ).length
      ? {
          url: site_content
            .find("div.nav-links > div.nav-previous > a")
            .attr("href")!,
          path: site_content
            .find("div.nav-links > div.nav-previous > a")
            .attr("href")!
            .substring(this.baseUrl.length),
          parent_href: parent_href,
          title,
        }
      : null;

    return {
      url: url_chapter,
      path: url_chapter.substring(this.baseUrl.length),
      title,
      chapter_data,
      prev_chapter: prev_chapter !== undefined ? null : prev_chapter_data,
      next_chapter: next_chapter !== undefined ? null : next_chapter_data,
    };
  }
  getListByGenre(
    genre: Genre,
    page?: number | undefined,
    status?: NETTRUYEN_STATUS_FILTER | undefined,
    sort?: NETTRUYEN_SORT_FILTER | undefined
  ): Promise<ResponseListManga> {
    throw new Error("Method not implemented.");
  }
  async search(
    keyword: string,
    page?: number | undefined
  ): Promise<ResponseListManga> {
    keyword = keyword.replace(/\s/g, "-");
    const axios_get = await axios.get(
      `${this.baseUrl}/search/${keyword}${
        page !== undefined && page > 1 ? `/page/${page}` : ``
      }`
    );
    const $ = cheerio.load(axios_get.data);
    const wrap_items = $(
      "div.page-listing-item > div.row.row-eq-height > div > div"
    );

    const data: {
      _id: number;
      title: string;
      image_thumbnail: string;
      href: string;
    }[] = [];
    wrap_items.each((i, e) => {
      data.push({
        _id: i,
        title: $(e)
          .find("div.item-summary > div.post-title.font-title > h3 > a")
          .text(),
        image_thumbnail: $(e)
          .find("div.item-thumb.c-image-hover > a > img")
          .attr("data-src")!,
        href: $(e)
          .find("div.item-summary > div.post-title.font-title > h3 > a")
          .attr("href")!,
      });
    });

    const last_page = $("div.wp-pagenavi").find("a.last").attr("href")!;

    const totalPage = Number(
      last_page !== undefined
        ? last_page
            .substring(0, last_page.length - 1)
            .split("/")
            .at(-1)
        : page !== undefined
        ? page
        : 1
    );

    return {
      data,
      totalData: data.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext: page !== undefined ? page < totalPage : 1 < totalPage,
      canPrev: page !== undefined ? page > 1 : false,
    };
  }
}
