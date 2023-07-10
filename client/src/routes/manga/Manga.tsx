import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/router";
import { Fragment, useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import MangaLibAPI from "~/apis/MangaLibAPI";
import CustomBox from "~/components/CustomBox";
import CustomImage from "~/components/CustomImage";
import CustomPagination from "~/components/CustomPagination";
import useDebounce from "~/hooks/Debounce";

type SearchProps = { page?: number };

function MangaRoute() {
  const search: SearchProps = useSearch({ from: "/manga/" });
  const navigate = useNavigate();

  const [inputName, setInputName] = useState<string>("");
  const title = useDebounce<string>(inputName);

  const {
    data: dataSearch,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    refetch,
  } = useQuery({
    queryKey: ["mangaLib", "lastest", "search"],
    queryFn: async () => {
      if (title == "") return null;
      const res = await MangaLibAPI.search("nettruyen", title);
      if (!res || res.status >= 300) throw new Error();
      return res.data;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mangaLib", "lastest", search.page],
    queryFn: () => MangaLibAPI.lastest("nettruyen", search.page),
  });

  useEffect(() => {
    refetch();
  }, [title]);

  function onPageChange(page: number) {
    if (page != 1) navigate({ to: "/manga", search: { page } });
    else navigate({ to: "/manga", search: { page: undefined } });
  }

  function clearSearch() {
    setInputName(() => "");
  }

  function findSearch() {
    clearSearch();
  }

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
        <CustomPagination total={10} onPageChange={() => {}} />
      </CustomBox>
    );
  if (isError) return <div>Error</div>;

  const res = data.data;
  const { data: mangas, totalPage } = res;

  return (
    <CustomBox>
      <div className="row-center">
        <Paper
          component="form"
          className="max-sm:w-[9%] sm:w-[400px] relative"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={inputName}
            onChange={(event) => setInputName(() => event.target.value)}
            placeholder="Search name"
            inputProps={{ "aria-label": "search name" }}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={findSearch}
          >
            <SearchIcon />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            color="primary"
            sx={{ p: "10px" }}
            aria-label="directions"
            onClick={clearSearch}
          >
            <CloseIcon />
          </IconButton>
          {dataSearch && !isLoadingSearch && !isErrorSearch && (
            <SimpleBar className="absolute mt-1 top-full left-0 w-full h-64 z-10 rounded-lg bg-white overflow-y-auto">
              {dataSearch.data.map((item, index) => {
                const url = new URL(item.href);
                const path = url.pathname.replace("/truyen-tranh/", "");

                return (
                  <Link
                    key={index}
                    to="/manga/$path"
                    params={{ path }}
                    className="border p-2 flex items-center gap-2 hover:bg-black hover:bg-opacity-10"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-black border-opacity-20 drop-shadow-lg">
                      <CustomImage
                        className="h-full bg-slate-300"
                        src={item.image_thumbnail}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="line-clamp-2 font-bold">{item.title}</div>
                      {item.chapters ? (
                        <div className="row-between">
                          <div>{item.chapters[0].content}</div>
                          <i>{item.chapters[0].time}</i>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  </Link>
                );
              })}
            </SimpleBar>
          )}
        </Paper>
      </div>
      <br />
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
      <CustomPagination total={totalPage} onPageChange={onPageChange} />
    </CustomBox>
  );
}

export default MangaRoute;
