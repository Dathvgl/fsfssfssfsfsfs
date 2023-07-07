import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import SimpleBar from "simplebar-react";
import MusicAPI from "~/apis/MusicAPI";
import CustomImage from "~/components/CustomImage";

type MusicTracksProps = {
  search: string;
  callback: (uri: string) => void;
  accessToken?: string;
};

function MusicTracks(props: MusicTracksProps) {
  const { search, callback, accessToken } = props;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["music", "spotify", "search", search, accessToken],
    queryFn: async () => {
      if (!search) return null;
      if (!accessToken) return null;
      const res = await MusicAPI.search({ q: search, type: "track" });
      if (!res || res.statusCode >= 300) throw new Error();
      return res.body;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    refetch();
  }, [search]);

  if (isLoading) return <></>;
  if (isError) return <></>;

  return (
    <SimpleBar className="h-96 overflow-y-auto rounded">
      {data?.tracks?.items.map((item, index) => (
        <div
          key={index}
          className="px-2 py-1 flex gap-4 hover:bg-black hover:bg-opacity-10 cursor-pointer"
          onClick={() => callback(item.uri)}
        >
          <div className="w-20 h-20 aspect-square">
            <CustomImage
              className="h-full rounded"
              src={item.album.images[2].url}
            />
          </div>
          <div>{item.name}</div>
        </div>
      ))}
    </SimpleBar>
  );
}

export default MusicTracks;
