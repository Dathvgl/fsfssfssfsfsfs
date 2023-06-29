import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Button, Skeleton, Toolbar } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/router";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MangaFollowAPI from "~/apis/MangaFollowAPI";
import MangaLibAPI from "~/apis/MangaLibAPI";
import { CustomWrap } from "~/components/CustomBox";
import CustomTitle from "~/components/CustomTitle";
import useLocalStorage from "~/hooks/LocalStorage";
import { useAppSelector } from "~/redux/store";
import { ResponseChapter } from "~/types/mangaLib";
import { MangaFollowUpdate } from "~/types/mongo/mangaFollowDB";
import { envs } from "~/utils/Enviroments";

type ArrowKey = "ArrowLeft" | "ArrowRight";

type MangaChapterDetailProps = {
  chapter: ResponseChapter;
  keyCode?: ArrowKey;
  keyFn?: () => void;
  zoom: number;
  zoomFn: (num: number) => void;
};

function MangaChapterDetail(props: MangaChapterDetailProps) {
  const { chapter, keyCode, keyFn, zoom, zoomFn } = props;

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Key", keyCode);
    if (keyCode) {
      onNavigate(keyCode);
      keyFn?.();
    }
  }, [keyCode]);

  function chapterUrl(key: ArrowKey) {
    if (key == "ArrowLeft") {
      return chapter.prev_chapter?.url;
    } else return chapter.next_chapter?.url;
  }

  function onNavigate(key: ArrowKey) {
    const url = chapterUrl(key);
    if (!url) return;
    const path = new URL(url).pathname
      .replace("/truyen-tranh/", "")
      .replaceAll("/", "==");
    navigate({ to: "/manga/chapter/$path", params: { path } });
  }

  return (
    <CustomWrap>
      <div className="w-full">
        <Toolbar />
        <div className="p-4">
          <CustomTitle>{chapter.title}</CustomTitle>
        </div>
        <div className="w-100 flex justify-center">
          <div
            style={{ width: `${zoom}%` }}
            className="flex flex-col items-center"
          >
            {chapter.chapter_data.map((item, index) => (
              <LazyLoadImage
                key={index}
                effect="black-and-white"
                src={item.src_cdn ?? item.src_origin}
              />
            ))}
          </div>
        </div>
        <div className="fixed bottom-10 right-10 flex gap-2 max-[960px]:hidden z-50">
          <button
            className="rounded-full bg-gray-200 p-2 border border-black drop-shadow-lg center-flex item-hover"
            onClick={() => zoomFn(1)}
          >
            <ZoomInIcon />
          </button>
          <button
            className="rounded-full bg-gray-200 p-2 border border-black drop-shadow-lg center-flex item-hover"
            onClick={() => zoomFn(-1)}
          >
            <ZoomOutIcon />
          </button>
        </div>
      </div>
      <br />
      <div className="w-full row-center">
        <div className="w-1/2 gap-4 row-center">
          <Button
            className="flex-1"
            variant="outlined"
            disabled={chapter.prev_chapter == null}
            startIcon={<ArrowBackIcon />}
            onClick={() => onNavigate("ArrowLeft")}
          >
            PREV
          </Button>
          <Button
            className="flex-1"
            variant="outlined"
            disabled={chapter.next_chapter == null}
            endIcon={<ArrowForwardIcon />}
            onClick={() => onNavigate("ArrowRight")}
          >
            NEXT
          </Button>
        </div>
      </div>
      <br />
    </CustomWrap>
  );
}

function MangaChapter() {
  const { path } = useParams();
  const { isUser } = useAppSelector((state) => state.user);

  const url = `${envs.VITE_NETTRUYEN}/truyen-tranh/${path?.replaceAll(
    "==",
    "/"
  )}`;

  const split = path?.split("==");
  const link = split?.[0] || "";

  const { data: datafollow } = useQuery({
    queryKey: ["mangaFollow", "follow", isUser],
    queryFn: async () => {
      if (!isUser) return null;
      const res = await MangaFollowAPI.getFollowChapter("nettruyen", link);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  const check = datafollow == null || datafollow == undefined;
  const { mutate } = useMutation({
    mutationKey: ["mangaFollow", "follow", "mutate", isUser, check],
    mutationFn: async () => {
      if (!isUser) return null;
      if (!datafollow) return;
      const chapter = Number.parseFloat(
        (split?.[1] ?? "0").replace("chap-", "")
      );

      const data: MangaFollowUpdate = {
        currentRead: chapter,
        currentReadUrl: path ?? "",
      };

      if (datafollow.lastestRead < chapter) {
        data.lastestRead = chapter;
        data.lastestReadUrl = path;
      }

      const res = await MangaFollowAPI.putFollow(
        datafollow._id,
        "nettruyen",
        data
      );

      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  const {
    data: dataChapter,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mangaLib", "manga", path],
    queryFn: async () => {
      const res = await MangaLibAPI.chapter("nettruyen", url);
      if (!res || res.status != 200) throw new Error();
      return res.data
    },
  });

  const { getLocal, setLocal } = useLocalStorage<string>("chapterZoom");

  const [keyCode, setKeyCode] = useState<ArrowKey>();
  const [chapterZoom, setChapterZoom] = useState(
    Number.parseInt(getLocal() ?? "100")
  );

  useEffect(() => {
    if (!getLocal()) setLocal(chapterZoom.toString());

    function handleKey(event: KeyboardEvent) {
      if (event.key == "ArrowLeft") {
        setKeyCode(() => "ArrowLeft");
      } else if (event.key == "ArrowRight") {
        setKeyCode(() => "ArrowRight");
      }
    }

    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  useEffect(() => {
    mutate();
  }, [isUser, check, url]);

  function onZoom(num: number) {
    const result = chapterZoom + 5 * num;
    if (result <= 0 || result > 100) return;
    setLocal(result.toString());
    setChapterZoom(() => result);
  }

  function resetCode() {
    setKeyCode(() => undefined);
  }

  if (isLoading)
    return (
      <CustomWrap>
        <div className="w-full">
          <Toolbar />
          <div className="w-full">
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="w-full row-center">
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    width="50%"
                    height="20rem"
                  />
                </div>
              ))}
            <br />
            <div className="w-full row-center">
              <div className="w-1/2 gap-4 row-center">
                <Button
                  className="flex-1"
                  variant="outlined"
                  disabled
                  startIcon={<ArrowBackIcon />}
                >
                  PREV
                </Button>
                <Button
                  className="flex-1"
                  variant="outlined"
                  disabled
                  endIcon={<ArrowForwardIcon />}
                >
                  NEXT
                </Button>
              </div>
            </div>
          </div>
        </div>
        <br />
      </CustomWrap>
    );
  if (isError) return <div>Error</div>;

  return (
    <MangaChapterDetail
      chapter={dataChapter}
      keyCode={keyCode}
      keyFn={resetCode}
      zoom={chapterZoom}
      zoomFn={onZoom}
    />
  );
}

export default MangaChapter;
