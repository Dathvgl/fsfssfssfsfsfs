import { Grid, Paper, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/router";
import { Fragment } from "react";
import MangaLibAPI from "~/apis/MangaLibAPI";
import CustomBox from "~/components/CustomBox";
import CustomImage from "~/components/CustomImage";
import CustomPagination from "~/components/CustomPagination";

function MangaRoute() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mangaLib", "lastest"],
    queryFn: () => MangaLibAPI.lastest("nettruyen"),
  });

  if (isLoading)
    return (
      <CustomBox>
        <Grid container spacing={3} justifyContent="space-around">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <Grid key={index} item>
                <Paper className="w-40 rounded overflow-hidden">
                  <Skeleton variant="rectangular" height="11rem" />
                  <Skeleton variant="text" height="2rem" />
                </Paper>
              </Grid>
            ))}
        </Grid>
        <br />
        <CustomPagination total={10} />
      </CustomBox>
    );
  if (isError) return <div>Error</div>;

  const res = data.data;
  const { data: mangas, totalPage } = res;

  return (
    <CustomBox>
      <Grid container spacing={3} justifyContent="space-around">
        {mangas.map((item, index) => {
          const url = new URL(item.href);
          const path = url.pathname.replace("/truyen-tranh/", "");

          return (
            <Grid key={index} item>
              <Paper className="w-40 overflow-hidden">
                <Link to="/manga/$path" params={{ path }}>
                  <CustomImage
                    className="h-44 bg-slate-300"
                    src={item.image_thumbnail}
                  />
                  <div className="p-1 line-clamp-2 font-bold">{item.title}</div>
                </Link>
                {item.chapters && (
                  <div className="p-1">
                    {item.chapters.map((item, index) => {
                      const chapter = item.content.replace("Chapter ", "");
                      const url = new URL(item.url);
                      const path = url.pathname
                        .replace("/truyen-tranh/", "")
                        .replaceAll("/", "==");

                      return (
                        <Fragment key={index}>
                          <div className="gap-2 text-sm row-between">
                            <Link
                              className="flex-1 line-clamp-1 hover:text-red-700 font-semibold"
                              to="/manga/chapter/$path"
                              params={{ path }}
                            >
                              {`Ch. ${chapter}`}
                            </Link>
                            <div className="italic text-xs text-slate-400">
                              {item.time}
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <br />
      <CustomPagination total={totalPage} />
    </CustomBox>
  );
}

export default MangaRoute;
