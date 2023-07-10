import { useRef, useEffect, ChangeEvent } from "react";
import { volumed } from "~/redux/slices/player";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";

function PlayerVolume() {
  const dispatch = useAppDispatch();
  const volume = useAppSelector((state) => state.player.volume);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const target = inputRef.current;
    const handleWheel = (event: WheelEvent) => {
      if (inputRef.current) {
        const value = Number.parseInt(inputRef.current.value);
        if (event.deltaY < 0) inputRef.current.value = `${value + 20}`;
        if (event.deltaY > 0) inputRef.current.value = `${value - 20}`;

        const range = Number.parseInt(inputRef.current.value);
        dispatch(volumed({ volume: range / 100 }));
      }
    };

    target?.addEventListener("wheel", handleWheel);

    return () => {
      target?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const range = Number.parseInt(event.target.value);
    dispatch(volumed({ volume: range / 100 }));
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {volume ? (
        volume < 0.5 ? (
          <VolumeDownIcon />
        ) : (
          <VolumeUpIcon />
        )
      ) : (
        <VolumeMuteIcon />
      )}

      <input
        ref={inputRef}
        type="range"
        min={0}
        max={100}
        onChange={onChange}
        value={volume * 100}
        className="w-32"
      />
    </div>
  );
}

export default PlayerVolume;
