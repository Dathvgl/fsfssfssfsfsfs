import { Grid, Paper, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/router";
import { useEffect, useState } from "react";
import MangaFollowAPI from "~/apis/MangaFollowAPI";
import CustomBox from "~/components/CustomBox";
import CustomImage from "~/components/CustomImage";
import CustomPagination from "~/components/CustomPagination";
import { useAppSelector } from "~/redux/store";
import { fromNow } from "~/utils/Extension";

const limit = 12;

function UserMangaFollow() {
  const { isUser } = useAppSelector((state) => state.user);

  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mangaFollow", "userFollow", "follow", offset, isUser],
    queryFn: async () => {
      if (!isUser) return null;
      const res = await MangaFollowAPI.getFollows("nettruyen", limit, offset);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  useEffect(() => {
    refetch();
  }, [offset]);

  function onPageChange(page: number) {
    const index = page - 1;
    setOffset(() => index * limit);
  }

  if (isLoading)
    return (
      <CustomBox>
        <Grid container spacing={3} justifyContent="space-around">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <Grid key={index} item xs={12} md={6}>
                <Paper className="w-full rounded overflow-hidden">
                  <Skeleton variant="rectangular" height="11rem" />
                  <Skeleton variant="text" height="2rem" />
                </Paper>
              </Grid>
            ))}
        </Grid>
      </CustomBox>
    );
  if (isError) return <></>;
  if (!data) return <></>;

  const { data: mangas, total } = data;

  return (
    <CustomBox>
      <Grid container spacing={3} justifyContent="space-around">
        {mangas.map((item, index) => {
          return (
            <Grid key={index} item xs={12} md={6}>
              <Paper className="w-full p-2 gap-2 flex justify-between items-stretch">
                <Link
                  className="w-40 rounded overflow-hidden border border-black"
                  to="/manga/$path"
                  params={{ path: item.url }}
                >
                  <CustomImage className="h-44 bg-slate-300" src={item.cover} />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 text-lg">
                    <div className="line-clamp-2 font-bold">{item.title}</div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="gap-2 row-between">
                      <div>
                        Current Read:{" "}
                        <Link
                          className="font-semibold hover:text-red-500"
                          to="/manga/chapter/$path"
                          params={{ path: item.currentReadUrl }}
                        >
                          Chap {item.currentRead}
                        </Link>
                      </div>
                      <div className="text-end">
                        Lastest Read:{" "}
                        <Link
                          className="font-semibold hover:text-red-500"
                          to="/manga/chapter/$path"
                          params={{ path: item.lastestReadUrl }}
                        >
                          Chap {item.lastestRead}
                        </Link>
                      </div>
                    </div>
                    <div className="gap-2 row-between">
                      <div className="line-clamp-2">
                        Create at: {fromNow(item.createdAt)}
                      </div>
                      <div className="line-clamp-2 text-end">
                        Update at: {fromNow(item.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <br />
      <CustomPagination
        total={Math.ceil(total / 12)}
        onPageChange={onPageChange}
      />
    </CustomBox>
  );
}

export default UserMangaFollow;
