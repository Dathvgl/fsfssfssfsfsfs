import { useAppSelector } from "~/redux/store";
import PlayerAudio from "./components/audio/Audio";
import PlayerInfo from "./components/Info";
import PlayerVolume from "./components/Volume";

function ZingMP3PlayerControls(props: { src: string }) {
  const { src } = props;

  return (
    <div className="w-full p-4 grid grid-cols-3 gap-4 bg-blue-300">
      <PlayerInfo />
      <PlayerAudio src={src} />
      <PlayerVolume />
    </div>
  );
}

function ZingMP3Player() {
  const player = useAppSelector((state) => state.player);
  if (!player.id || !player.src) return <></>;
  return <ZingMP3PlayerControls src={player.src} />;
}

export default ZingMP3Player;
