import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import ZingMP3API from "~/apis/ZingMP3API";
import CustomImage from "~/components/CustomImage";
import useDebounce from "~/hooks/Debounce";
import { ZingMP3Src } from "~/routes/music/Player";
import { durationUTC } from "~/utils/date";

function ZingMP3SearchList(props: { name: string }) {
  const { name } = props;

  const {
    data,
    isLoading: isLoading,
    isError: isError,
    refetch,
  } = useQuery({
    queryKey: ["zing", "mp3", "search"],
    queryFn: async () => {
      if (name == "") return null;
      return await ZingMP3API.search(name);
    },
  });

  useEffect(() => {
    refetch();
  }, [name]);

  if (isLoading) return <></>;
  if (isError) return <></>;
  if (!data) return <></>;

  const { songs } = data.data.data;

  if (!songs || songs?.length == 0) {
    return (
      <div className="px-2 py-1.5 font-bold absolute mt-1 top-full left-0 w-full z-10 rounded-lg bg-white">
        No results
      </div>
    );
  }

  return (
    <SimpleBar className="absolute mt-1 top-full left-0 w-full h-64 z-10 rounded-lg bg-white overflow-y-auto">
      {songs.map((item, index) => (
        <div
          key={index}
          className="px-2 py-1.5 cursor-pointer gap-2 flex justify-between items-center hover:bg-black hover:bg-opacity-20 group group/icon"
          onClick={async () => await ZingMP3Src(item.encodeId)}
        >
          <div className="w-12 h-12">
            <CustomImage className="h-full rounded" src={item.thumbnail} />
          </div>
          <div className="text-sm flex-1">
            <div className="flex items-center gap-2">
              <div className="font-bold text-base line-clamp-1">
                {item.title}
              </div>
              <i>{durationUTC(item.duration)}</i>
            </div>
            <div className="line-clamp-1">
              {item.artists?.map(({ name }) => name).join(", ")}
            </div>
          </div>
        </div>
      ))}
    </SimpleBar>
  );
}

function ZingMP3Search() {
  const [inputName, setInputName] = useState<string>("");
  const name = useDebounce<string>(inputName);

  function clearSearch() {
    setInputName(() => "");
  }

  function findSearch() {
    clearSearch();
  }

  return (
    <>
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
          <ZingMP3SearchList name={name} />
        </Paper>
      </div>
    </>
  );
}

export default ZingMP3Search;
