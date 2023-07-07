import { Alert, Button, Paper } from "@mui/material";
import { ReactNode } from "react";
import { authMusicUrl } from "~/apis/MusicAPI";
import { CustomScreen, CustomWrap } from "~/components/CustomBox";
import { useAppSelector } from "~/redux/store";
import MusicRoute from "~/routes/music/Music";

export function LayoutAuth(props: { children: ReactNode }) {
  const { children } = props;
  const { isUser } = useAppSelector((state) => state.user);

  return isUser ? (
    <>{children}</>
  ) : (
    <CustomWrap>
      <div className="h-screen row-center">
        <Paper>
          <Alert severity="error">You must login</Alert>
        </Paper>
      </div>
    </CustomWrap>
  );
}

export function LayoutAuthMusic() {
  const code = new URLSearchParams(window.location.search).get("code");

  return code ? (
    <MusicRoute code={code} />
  ) : (
    <CustomScreen>
      <div className="h-full row-center">
        <Button variant="contained" href={authMusicUrl}>
          Into Spotify
        </Button>
      </div>
    </CustomScreen>
  );
}
