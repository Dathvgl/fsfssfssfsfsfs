export type MangaType = "nettruyen" | "toonily";

export type ResponseListManga = {
  totalData: number;
  canNext: boolean;
  canPrev: boolean;
  totalPage: number;
  currentPage: number;
  data: {
    _id: number;
    image_thumbnail: string;
    title: string;
    href: string;
    chapters?: { url: string; content: string; time: string }[];
  }[];
};

export type Genre = {
  url?: string;
  name: string;
  path: string;
};

export type Chapter = {
  path: string;
  url: string;
  parent_href: string;
  title?: string;
  last_update?: string;
  views?: string;
};

export type ResponseDetailManga = {
  image_thumbnail: string;
  description: string;
  path: string;
  url: string;
  author: string;
  title: string;
  status: string;
  genres: Genre[];
  views: string;
  rate: string;
  rate_number: string;
  follows: string;
  chapters: Chapter[];
};

export type ImageChapter = {
  _id: number;
  src_origin: string;
  src_cdn?: string;
  alt: string;
};

export type ResponseChapter = {
  url: string;
  path: string;
  title: string;
  chapter_data: ImageChapter[];
  prev_chapter: Chapter | null;
  next_chapter: Chapter | null;
};
