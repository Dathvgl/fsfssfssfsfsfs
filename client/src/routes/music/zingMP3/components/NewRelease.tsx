import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import moment from "moment";
import { useState } from "react";
import CustomImage from "~/components/CustomImage";
import { ZingMP3Src } from "~/routes/music/Player";
import { ZingMP3ReleaseSection } from "~/types/zingMP3/release";
import { capitalize } from "~/utils/Extension";

type FilterType = "all" | "vPop" | "others";

function ZingMP3NewRelease(props: { data?: unknown | undefined }) {
  const { data } = props;
  if (!data) {
    return <></>;
  }

  const { title, items } = data as ZingMP3ReleaseSection;

  const [filter, setFilter] = useState<FilterType>("all");

  function onFilter(str: FilterType) {
    setFilter(() => str);
  }

  return (
    <>
      <div className="mt-9">
        <div className="font-bold text-2xl">{title}</div>
        <br />
        <div className="flex justify-between items-center text-xs font-semibold">
          <div className="flex gap-4">
            <button
              className={`px-6 py-2 rounded-3xl border ${
                filter == "all" && "bg-blue-500"
              }`}
              onClick={() => onFilter("all")}
            >
              TẤT CẢ
            </button>
            <button
              className={`px-6 py-2 rounded-3xl border ${
                filter == "vPop" && "bg-blue-500"
              }`}
              onClick={() => onFilter("vPop")}
            >
              VIỆT NAM
            </button>
            <button
              className={`px-6 py-2 rounded-3xl border ${
                filter == "others" && "bg-blue-500"
              }`}
              onClick={() => onFilter("others")}
            >
              QUỐC TẾ
            </button>
          </div>
          <div className="flex items-center hover:text-blue-500">
            <div className="pr-1">TẤT CẢ</div>
            <KeyboardArrowRightIcon />
          </div>
        </div>
        <br />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
          {items[filter].slice(0, 12).map((item, index) => (
            <div
              key={index}
              className="px-2 py-1 cursor-pointer gap-2 flex justify-between items-center hover:bg-black hover:bg-opacity-20 rounded-md  group group/icon"
              onClick={async () => await ZingMP3Src(item.encodeId)}
            >
              <div className="w-12 h-12">
                <CustomImage className="h-full rounded" src={item.thumbnail} />
              </div>
              <div className="text-sm flex-1">
                <div className="font-bold line-clamp-1">{item.title}</div>
                <div className="line-clamp-1">
                  {item.artists.map(({ name }) => name).join(", ")}
                </div>
                <div>
                  {capitalize(
                    moment.unix(item.releaseDate).locale("vi").fromNow()
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ZingMP3NewRelease;
