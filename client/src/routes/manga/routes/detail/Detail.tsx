import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import StreetviewIcon from "@mui/icons-material/Streetview";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/router";
import SimpleBar from "simplebar-react";
import MangaLibAPI from "~/apis/MangaLibAPI";
import CustomBox from "~/components/CustomBox";
import CustomImage from "~/components/CustomImage";
import CustomTitle from "~/components/CustomTitle";
import { envs } from "~/utils/Enviroments";
import DetailButton from "./components/Button";

function MangaDetail() {
  const { path } = useParams();
  const url = `${envs.VITE_NETTRUYEN}/truyen-tranh/${path}`;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mangaLib", "manga", path],
    queryFn: () => MangaLibAPI.manga("nettruyen", url),
  });

  if (isLoading)
    return (
      <CustomBox>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="text" height="2rem" />
              <div className="h-72 gap-4 flex justify-between">
                <Skeleton variant="rounded" width="15rem" height="100%" />
                <div className="flex-1 text-justify h-full overflow-y-auto">
                  {Array(10)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton key={index} variant="text" />
                    ))}
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Skeleton variant="rounded" height="18rem" />
            </Paper>
          </Grid>
        </Grid>
      </CustomBox>
    );
  if (isError) return <div>Error</div>;

  const manga = data.data;

  return (
    <CustomBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <CustomTitle>{manga.title}</CustomTitle>
            <div className="sm:h-72 gap-4 flex max-sm:flex-col justify-between max-sm:items-center">
              <div className="w-60 h-72 rounded-lg overflow-hidden border border-black border-opacity-20 drop-shadow-lg">
                <CustomImage
                  className="h-full bg-slate-300"
                  src={manga.image_thumbnail}
                />
              </div>
              <SimpleBar className="sm:flex-1 w-full text-justify h-full max-sm:h-40 overflow-y-auto">
                {manga.description}
              </SimpleBar>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <div className="flex gap-4 max-sm:justify-between">
              <Button variant="contained">Read First</Button>
              <Button variant="contained">Read Last</Button>
              <DetailButton manga={manga} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            className="flex max-[960px]:flex-col justify-between gap-2"
            sx={{ p: 2 }}
          >
            <div className="basis-[30%]">
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary={manga.author} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText primary={manga.rate} />
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={manga.rate_number} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StreetviewIcon />
                  </ListItemIcon>
                  <ListItemText primary={manga.follows} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ChromeReaderModeIcon />
                  </ListItemIcon>
                  <ListItemText primary={manga.views} />
                </ListItem>
              </List>
              <div className="flex flex-wrap gap-4 text-sm font-semibold">
                {manga.genres.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      className="px-2 py-1 rounded bg-gray-300 hover:bg-red-300"
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="grow-[7] max-[960px]:border max-[960px]:border-black max-[960px]:rounded max-[960px]:p-4">
              <div className="h-72 relative cutoff flex flex-col divide-y-2">
                {manga.chapters.map((item, index, { length }) => {
                  const path = item.path
                    .replace("/truyen-tranh/", "")
                    .replaceAll("/", "==");

                  return (
                    <div
                      key={index}
                      className={`row-between ${
                        index == 0
                          ? "pb-1"
                          : index == length - 1
                          ? "pt-1"
                          : "py-1"
                      }`}
                    >
                      <Link
                        className="hover:text-red-700 font-semibold"
                        to="/manga/chapter/$path"
                        params={{ path }}
                      >
                        {item.title}
                      </Link>
                      <div>{item.last_update}</div>
                    </div>
                  );
                })}
              </div>
              <input className="w-full cutoff-btn" type="checkbox" />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </CustomBox>
  );
}

export default MangaDetail;
