import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MangaFollowAPI from "~/apis/MangaFollowAPI";
import { ResponseDetailManga } from "~/types/mangaLib";
import { MangaFollowInfo } from "~/types/mongo/mangaFollowDB";

type FollowType = "follow" | "unfollow";
type MutateProps = {
  type: FollowType;
  datas?: MangaFollowInfo;
};

function DetailButton(props: { manga: ResponseDetailManga }) {
  const { manga } = props;
  const url = new URL(manga.url);
  const path = url.pathname.replace("/truyen-tranh/", "");

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["mangaFollow", "follow"],
    queryFn: async () => {
      const res = await MangaFollowAPI.getFollow("nettruyen", path);
      if (res.status != 200) throw new Error();
      return res.data;
    },
  });

  const follow = !(data == undefined || data == null);

  console.log(follow);
  const { mutate } = useMutation({
    mutationFn: async ({ type, datas }: MutateProps) => {
      if (type == "follow" && datas) {
        if (data == undefined || data == null) return
        const res = await MangaFollowAPI.postFollow(datas);
        if (res.status != 200) throw new Error();
        return res.data;
      } else {
        if (!data) return;
        const res = await MangaFollowAPI.deleteFollow(data._id, "nettruyen");
        if (res.status != 200) throw new Error();
        return res.data;
      }
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["mangaFollow", "follow"],
      });
    },
  });

  function onFollow() {
    if (follow) {
      mutate({ type: "unfollow" });
    } else {
      const data: MangaFollowInfo = {
        type: "nettruyen",
        url: path,
        title: manga.title,
        cover: manga.image_thumbnail,
        currentRead: -1,
        currentReadUrl: "",
        lastestRead: -1,
        lastestReadUrl: "",
      };

      mutate({ type: "follow", datas: data });
    }
  }

  return (
    <>
      <Button
        color={follow ? "error" : "success"}
        variant="contained"
        onClick={onFollow}
      >
        {follow ? "Unfollow" : "Follow"}
      </Button>
      <Button variant="contained" onClick={onFollow}>
        Continue
      </Button>
    </>
  );
}

export default DetailButton;
