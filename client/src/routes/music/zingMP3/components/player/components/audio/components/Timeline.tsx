import { ChangeEvent, RefObject, useEffect, useState } from "react";
import { played } from "~/redux/slices/player";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { durationUTC } from "~/utils/Date";

function AudioTimeline(props: { audioRef: RefObject<HTMLAudioElement> }) {
  const { audioRef } = props;

  const dispatch = useAppDispatch();
  const player = useAppSelector((state) => state.player);

  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.onloadedmetadata = () => {
      setDuration(() => audioRef.current!.duration);
    };

    audioRef.current.ontimeupdate = () => {
      setTime(() => audioRef.current!.currentTime);
    };

    audioRef.current.onended = () => {
      dispatch(played({ played: false }));
      audioRef.current!.currentTime = 0;
    };
  }, [player.id]);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (!audioRef.current) return;
    const range = Number.parseFloat(event.target.value);
    audioRef.current.currentTime = range;
  }
  return (
    <div className="flex items-center gap-4">
      <div>{durationUTC(time)}</div>
      <input
        className="w-96"
        type="range"
        value={time}
        min={0}
        max={duration}
        onChange={onChange}
      />
      <div>{durationUTC(duration)}</div>
    </div>
  );
}

export default AudioTimeline;
