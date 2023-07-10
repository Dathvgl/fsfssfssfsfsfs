import { useQuery } from "@tanstack/react-query";
import ZingMP3API from "~/apis/ZingMP3API";
import CustomImage from "~/components/CustomImage";
import { useAppSelector } from "~/redux/store";

function PlayerInfo() {
  const player = useAppSelector((state) => state.player);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["zing", "mp3", "info", "song", player.id],
    queryFn: async () => {
      if (!player.id) return null;
      const res = await ZingMP3API.infoSong(player.id);
      if (!res || res.status >= 300) throw new Error();
      return res.data;
    },
  });

  if (isLoading) return <></>;
  if (isError) return <></>;
  if (!data) return <></>;

  const song = data.data;

  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-12">
        <CustomImage className="h-full rounded" src={song.thumbnail} />
      </div>
      <div className="font-bold text-base">{song.title}</div>
    </div>
  );
}

export default PlayerInfo;
