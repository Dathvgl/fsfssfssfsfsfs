import {
  NETTRUYEN_SORT_FILTER,
  NETTRUYEN_STATUS_FILTER,
} from "manga-lib/dist/src/constants/filter";
import puppeteer, { Browser } from "puppeteer";
import {
  AbstractMangaFactory,
  Chapter,
  Genre,
  ImageChapter,
  ResponseChapter,
  ResponseDetailManga,
  ResponseListManga,
} from "types/mangaLib";
import { notNull } from "utils/check";

export class Nettruyen implements AbstractMangaFactory {
  baseUrl: string;
  all_genres: Genre[];
  browser: Promise<Browser>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.browser = puppeteer.launch({
      headless: "new",
      args: [
        // "--disable-dev-shm-usage",
        // "--disable-setupid-sandbox",
        // "--no-sandbox",
        // "--single-process",
        // "--no-zygote",
        "--disable-speech-api",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-update",
        "--disable-default-apps",
        "--disable-dev-shm-usage",
        "--disable-domain-reliability",
        "--disable-extensions",
        "--disable-features=AudioServiceOutOfProcess",
        "--disable-hang-monitor",
        "--disable-ipc-flooding-protection",
        "--disable-notifications",
        "--disable-offer-store-unmasked-wallet-cards",
        "--disable-popup-blocking",
        "--disable-print-preview",
        "--disable-prompt-on-repost",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-sync",
        "--hide-scrollbars",
        "--ignore-gpu-blacklist",
        "--metrics-recording-only",
        "--mute-audio",
        "--no-default-browser-check",
        "--no-first-run",
        "--no-pings",
        "--no-sandbox",
        "--no-zygote",
        "--password-store=basic",
        "--use-gl=swiftshader",
        "--use-mock-keychain",
      ],
      executablePath:
        process.env.NODE_ENV == "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    this.all_genres = [] as Genre[];
  }

  async search(keyword: string, page = 1): Promise<ResponseListManga> {
    const _page = await (await this.browser).newPage();
    await _page.goto(
      `${this.baseUrl}/tim-truyen?keyword=${keyword}${
        page > 1 ? `&page=${page}` : ``
      }`,
      { waitUntil: "networkidle0" }
    );

    const element = await _page.$$(
      "#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure"
    );

    const is_multipage = await _page
      .$eval("#ctl00_mainContent_ctl01_divPager", () => true)
      .catch(() => false);

    const canNext = is_multipage
      ? await _page
          .$eval(
            "#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page",
            () => true
          )
          .catch(() => false)
      : false;

    const canPrev = is_multipage
      ? await _page
          .$eval(
            "#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page",
            () => true
          )
          .catch(() => false)
      : false;

    const totalPage = is_multipage
      ? parseInt(
          notNull(
            await _page.$eval(
              "#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a",
              (el) => el.getAttribute("href")
            )
          ).split("page=")[1]
        )
      : 0;

    return {
      totalData: element.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext,
      canPrev,
      data: await Promise.all(
        element.map(async (e, i) => {
          const href = notNull(
            await e.$eval("div.image > a", (el) => el.getAttribute("href"))
          );

          const title = notNull(
            await e.$eval("figcaption > h3 > a", (el) => el.textContent)
          );

          const image_thumbnail = notNull(
            await e.$eval("div.image > a > img", (el) =>
              el.getAttribute("data-original")
            )
          );

          const links = await e.$$("figure > figcaption > ul > li");
          const chapters = links.map(async (el) => {
            const chapter = await el.$eval("a", (el) => {
              return {
                url: el.getAttribute("href"),
                content: el.textContent,
              };
            });

            const time = await el.$eval("i", (el) => el.textContent);

            return {
              url: notNull(chapter.url),
              content: notNull(chapter.content),
              time: notNull(time),
            };
          });

          return {
            _id: i,
            title,
            image_thumbnail: image_thumbnail.startsWith("//")
              ? `https:${image_thumbnail}`
              : image_thumbnail,
            href,
            chapters: await Promise.all(chapters),
          };
        })
      ),
    };
  }

  async getListByGenre(
    genre: Genre,
    page?: number,
    status?: NETTRUYEN_STATUS_FILTER,
    sort?: NETTRUYEN_SORT_FILTER
  ): Promise<ResponseListManga> {
    const _page = await (await this.browser).newPage();
    let path = genre.path;
    if (sort !== undefined) {
      path += `?sort=${sort}${
        status !== undefined ? `&status=${status}` : "&status=-1"
      }${page !== undefined ? `&page=${page}` : ""}`;
    } else if (status !== undefined) {
      path += `?status=${status}${page !== undefined ? `&page=${page}` : ""}`;
    } else if (page !== undefined) {
      path += `?page=${page}`;
    }
    await _page.goto(`${this.baseUrl}${path}`, { waitUntil: "networkidle0" });
    const element = await _page.$$(
      "#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure"
    );

    const canNext = await _page
      .$eval(
        "#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page",
        () => true
      )
      .catch(() => false);

    const canPrev = await _page
      .$eval(
        "#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page",
        () => true
      )
      .catch(() => false);

    const totalPage = parseInt(
      notNull(
        await _page.$eval(
          "#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a",
          (el) => el.getAttribute("href")
        )
      ).split("page=")[1]
    );

    return {
      totalData: element.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext,
      canPrev,
      data: await Promise.all(
        element.map(async (e, i) => {
          const href = notNull(
            await e.$eval("div.image > a", (el) => el.getAttribute("href"))
          );

          const title = notNull(
            await e.$eval("figcaption > h3 > a", (el) => el.textContent)
          );

          const image_thumbnail = notNull(
            await e.$eval("div.image > a > img", (el) =>
              el.getAttribute("data-original")
            )
          );

          const links = await e.$$("figure > figcaption > ul > li");
          const chapters = links.map(async (el) => {
            const chapter = await el.$eval("a", (el) => {
              return {
                url: el.getAttribute("href"),
                content: el.textContent,
              };
            });

            const time = await el.$eval("i", (el) => el.textContent);

            return {
              url: notNull(chapter.url),
              content: notNull(chapter.content),
              time: notNull(time),
            };
          });

          return {
            _id: i,
            title,
            image_thumbnail: image_thumbnail.startsWith("//")
              ? `https:${image_thumbnail}`
              : image_thumbnail,
            href,
            chapters: await Promise.all(chapters),
          };
        })
      ),
    };
  }

  async getDataChapter(
    url_chapter: string,
    url?: string,
    path?: string,
    prev_chapter?: Chapter,
    next_chapter?: Chapter
  ): Promise<ResponseChapter> {
    url = url !== undefined ? url : "";
    path = path !== undefined ? path : "";

    const _page = await (await this.browser).newPage();
    await _page.goto(url_chapter, { waitUntil: "networkidle0" });
    const content = await _page.$(
      "#ctl00_divCenter > div > div.reading-detail.box_doc"
    );
    const title = notNull(
      await _page.$eval(
        "#ctl00_divCenter > div > div:nth-child(1) > div.top > h1",
        (el) => el.textContent
      )
    );
    const images: ImageChapter[] = await Promise.all(
      (
        await content!.$$("div.page-chapter > img")
      ).map(async (e, i) => {
        const _data_image = await e.evaluate((el) => {
          return {
            src_origin: el.getAttribute("data-original"),
            src_cdn: el.getAttribute("data-cdn"),
            alt: el.getAttribute("alt"),
          };
        });
        return {
          _id: i,
          src_origin: notNull(_data_image.src_origin).startsWith("//")
            ? `https:${notNull(_data_image.src_origin)}`
            : notNull(_data_image.src_origin),
          ...(notNull(_data_image.src_cdn) !== ""
            ? {
                src_cdn: notNull(_data_image.src_cdn).startsWith("//")
                  ? `https:${notNull(_data_image.src_cdn)}`
                  : notNull(_data_image.src_cdn),
              }
            : {}),
          alt: notNull(_data_image.alt),
        };
      })
    );
    const prev: Chapter = {} as Chapter;
    if (prev_chapter === undefined) {
      const prev_chapter_get = await _page.$eval(
        "#chapterNav > a.prev.a_prev",
        (el) => {
          return {
            url_chapter: el.getAttribute("href"),
          };
        }
      );
      prev.url = notNull(prev_chapter_get.url_chapter);
      prev.parent_href = url;
      prev.path = url.substring(`${this.baseUrl}`.length);
    }
    const next: Chapter = {} as Chapter;
    if (next_chapter === undefined) {
      const next_chapter_get = await _page.$eval(
        "#chapterNav > a.next.a_next",
        (el) => {
          return {
            url_chapter: el.getAttribute("href"),
          };
        }
      );
      next.url = notNull(next_chapter_get.url_chapter);
      next.parent_href = url;
      next.path = url.substring(`${this.baseUrl}`.length);
    }

    return {
      url,
      path,
      chapter_data: images,
      title,
      next_chapter:
        next_chapter !== undefined
          ? next_chapter
          : next.url !== "#"
          ? next
          : null,
      prev_chapter:
        prev_chapter !== undefined
          ? prev_chapter
          : prev.url !== "#"
          ? prev
          : null,
    };
  }

  async getDetailManga(url: string): Promise<ResponseDetailManga> {
    const _page = await (await this.browser).newPage();
    await _page.goto(url, { waitUntil: "networkidle0" });
    const content = await _page.$("#ctl00_divCenter");
    const title = await content!.$eval("article > h1", (el) => el.textContent);
    const path = url.substring(`${this.baseUrl}`.length);
    const author = await content!.$eval(
      "#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.author.row > p.col-xs-8",
      (el) => el.textContent
    );

    const status = await content!.$eval(
      "#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.status.row > p.col-xs-8",
      (el) => el.textContent
    );

    const genres: Genre[] = await Promise.all(
      (
        await content!.$$(
          "#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.kind.row > p.col-xs-8 > a"
        )
      ).map(async (e) => {
        const data = await e.evaluate((el) => {
          return {
            url: el.getAttribute("href"),
            path: el.getAttribute("href"),
            name: el.textContent,
          };
        });
        return {
          url: notNull(data.url),
          path: notNull(data.path).substring(`${this.baseUrl}`.length),
          name: notNull(data.name),
        };
      })
    );

    const views = await content!.$eval(
      "#item-detail > div.detail-info > div.row > div.col-xs-8.col-info > ul > li:last-child > p.col-xs-8",
      (el) => el.textContent
    );

    const chapters: Chapter[] = await Promise.all(
      (
        await content!.$$(".list-chapter > nav > ul > li")
      ).map(async (e) => {
        const chapter_anchor = await e.$eval(".col-xs-5.chapter > a", (el) => {
          const data = {
            title: el.textContent,
            url: el.getAttribute("href"),
          };
          return {
            title: data.title,
            url: data.url,
          };
        });

        const last_update = await e.$eval(
          ".col-xs-4.text-center.no-wrap.small",
          (el) => el.textContent
        );
        const views_chapter = await e.$eval(
          ".col-xs-3.text-center.small",
          (el) => el.textContent
        );
        return {
          title: notNull(chapter_anchor.title),
          url: notNull(chapter_anchor.url),
          path: notNull(chapter_anchor.url).substring(`${this.baseUrl}`.length),
          parent_href: url,
          last_update: notNull(last_update),
          views: notNull(views_chapter),
        };
      })
    );

    const rate = notNull(
      await content!.$eval(
        "#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(1)",
        (el) => el.textContent
      )
    );

    const rate_number = notNull(
      await content!.$eval(
        "#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(3)",
        (el) => el.textContent
      )
    );
    const follows = notNull(
      await content!.$eval(
        "#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.follow > span > b",
        (el) => el.textContent
      )
    );

    const image_thumbnail = notNull(
      await content!.$eval(
        "#item-detail > div.detail-info > div > div.col-xs-4.col-image > img",
        (el) => el.getAttribute("src")
      )
    );

    const description = notNull(
      await content!.$eval(
        "#item-detail > div.detail-content > p",
        (el) => el.textContent
      )
    );

    return {
      image_thumbnail,
      description,
      title: notNull(title),
      path,
      author: notNull(author),
      url,
      status: notNull(status),
      genres,
      views: notNull(views),
      rate,
      rate_number,
      follows,
      chapters,
    };
  }

  async getListLatestUpdate(page = 1): Promise<ResponseListManga> {
    const _page = await (await this.browser).newPage();
    await _page.goto(`${this.baseUrl}${page > 1 ? `/?page=${page}` : ``}`, {
      waitUntil: "networkidle0",
    });

    const element = await _page.$$(
      "#ctl00_divCenter > div > div > div.items > div.row > div.item"
    );

    const canNext = await _page
      .$eval(
        "#ctl00_mainContent_ctl00_divPager > ul > li > a.next-page",
        () => true
      )
      .catch(() => false);

    const canPrev = await _page
      .$eval(
        "#ctl00_mainContent_ctl00_divPager > ul > li > a.prev-page",
        () => true
      )
      .catch(() => false);

    const totalPage = parseInt(
      notNull(
        await _page.$eval(
          "#ctl00_mainContent_ctl00_divPager > ul > li:last-child > a",
          (el) => el.getAttribute("href")
        )
      ).split("page=")[1]
    );

    return {
      totalData: element.length,
      totalPage,
      currentPage: page,
      canNext,
      canPrev,
      data: await Promise.all(
        element.map(async (e, i) => {
          const image_thumbnail: string = await e.$eval(
            ".image > a > img",
            (el) => el.getAttribute("data-original")!
          );

          const links = await e.$$("figure > figcaption > ul > li");
          const chapters = links.map(async (el) => {
            const chapter = await el.$eval("a", (el) => {
              return {
                url: el.getAttribute("href"),
                content: el.textContent,
              };
            });

            const time = await el.$eval("i", (el) => el.textContent);

            return {
              url: notNull(chapter.url),
              content: notNull(chapter.content),
              time: notNull(time),
            };
          });

          const link = await e.$eval("figure > figcaption > h3 > a", (el) => {
            return {
              title: el.textContent,
              href: el.getAttribute("href"),
            };
          });

          return {
            _id: i,
            title: notNull(link.title),
            href: notNull(link.href),
            image_thumbnail: image_thumbnail.startsWith("//")
              ? `https:${image_thumbnail}`
              : image_thumbnail,
            chapters: await Promise.all(chapters),
          };
        })
      ),
    };
  }
}
