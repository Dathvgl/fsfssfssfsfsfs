import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RepeatIcon from "@mui/icons-material/Repeat";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { IconButton } from "@mui/material";
import { useEffect, useRef } from "react";
import { played } from "~/redux/slices/player";
import { store, useAppSelector } from "~/redux/store";
import AudioTimeline from "./components/Timeline";

function PlayerAudio(props: { src: string }) {
  const { src } = props;

  const player = useAppSelector((state) => state.player);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = src;
    audioRef.current.load();
  }, [src]);

  useEffect(() => {
    if (!audioRef.current || player.played == undefined) return;

    if (!player.played) {
      audioRef.current.pause();
    } else audioRef.current.play();
  }, [player.played]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = player.volume;
  }, [player.volume]);

  function play() {
    if (!audioRef.current || !player.src) return;
    if (player.played == undefined) {
      store.dispatch(played({ played: true }));
    }

    store.dispatch(played({ played: !player.played }));
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <audio ref={audioRef}>
        <source src={player.src} type="audio/mp3" />
      </audio>
      <div className="row-center">
        <IconButton>
          <ShuffleIcon />
        </IconButton>
        <IconButton>
          <SkipPreviousIcon />
        </IconButton>
        {player.src !== undefined && (
          <IconButton onClick={play}>
            {player.played && <PauseCircleFilledIcon fontSize="large" />}
            {!player.played && <PlayCircleFilledIcon fontSize="large" />}
          </IconButton>
        )}
        <IconButton>
          <SkipNextIcon />
        </IconButton>
        <IconButton>
          <RepeatIcon />
        </IconButton>
      </div>
      <AudioTimeline audioRef={audioRef} />
    </div>
  );
}

export default PlayerAudio;
