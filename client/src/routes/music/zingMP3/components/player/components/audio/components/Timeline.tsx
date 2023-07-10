import { ChangeEvent, RefObject, useEffect, useState } from "react";
import { useAppSelector } from "~/redux/store";
import { durationUTC } from "~/utils/date";

function AudioTimeline(props: { audioRef: RefObject<HTMLAudioElement> }) {
  const { audioRef } = props;
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
