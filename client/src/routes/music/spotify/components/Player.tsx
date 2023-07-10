import { useState, useEffect } from "react";
// import SpotifyPlayer from "react-spotify-web-playback";

type MusicPlayerProps = {
  accessToken?: string;
  trackUri?: string;
};

function SpotifyPlayer(props: MusicPlayerProps) {
  const { accessToken, trackUri } = props;

  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken || !trackUri) return null;

  return (
    // <SpotifyPlayer
    //   token={accessToken}
    //   play={play}
    //   uris={trackUri ? [trackUri] : []}
    //   showSaveIcon
    //   callback={(state) => {
    //     if (!state.isPlaying) setPlay(false);
    //   }}
    // />
    <></>
  );
}

export default SpotifyPlayer;
