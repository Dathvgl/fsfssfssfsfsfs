import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { spotifyApi } from "~/apis/SpotifyAPI";
import CustomBox from "~/components/CustomBox";
import useDebounce from "~/hooks/Debounce";
import { useAuthMusic } from "~/hooks/Music";
import SpotifyPlayer from "./components/Player";
import SpotifyTracks from "./components/Tracks";

function SpotifyRoute(props: { code: string }) {
  const { code } = props;

  const [inputName, setInputName] = useState<string>("");
  const [trackUri, setTrackUri] = useState<string>();
  const searchStr = useDebounce(inputName);
  const accessToken = useAuthMusic(code);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  function clearSearch() {
    setInputName(() => "");
  }

  function findSearch() {
    clearSearch();
  }

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
        </Paper>
      </div>
      <br />
      <SpotifyTracks
        search={searchStr}
        accessToken={accessToken}
        callback={(uri) => setTrackUri(() => uri)}
      />
      <br />
      <SpotifyPlayer accessToken={accessToken} trackUri={trackUri} />
    </CustomBox>
  );
}

export default SpotifyRoute;
