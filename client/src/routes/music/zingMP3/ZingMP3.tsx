import { useQuery } from "@tanstack/react-query";
import ZingMP3API from "~/apis/ZingMP3API";
import { CustomScreen } from "~/components/CustomBox";
import FourItemHome from "./components/FourItem";
import ZingMP3NewRelease from "./components/NewRelease";
import RTChartHome from "./components/RTChart";
import ZingMP3Search from "./components/Search";
import ZingMP3Player from "./components/player/Player";
import SimpleBar from "simplebar-react";

function ZingMP3Route() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["zing", "mp3", "home"],
    queryFn: async () => {
      const res = await ZingMP3API.home();
      if (!res || res.status >= 300) throw new Error();
      return res.data;
    },
  });

  if (isLoading) return <></>;
  if (isError) return <></>;

  const { items } = data.data;

  return (
    <CustomScreen>
      <SimpleBar className="flex-1 min-h-0 p-8">
        <ZingMP3Search />
        {/* <BannerHome
          data={items.find((item) => {
            return (
              item?.sectionId == "hSlider" && item?.sectionType == "banner"
            );
          })}
        /> */}
        <ZingMP3NewRelease
          data={items.find((item) => {
            return item?.sectionType == "new-release";
          })}
        />
        <FourItemHome
          data={items.find((item) => {
            return (
              item?.sectionId == "hEditorTheme2" &&
              item?.sectionType == "playlist"
            );
          })}
          row={1}
        />
        <FourItemHome
          data={items.find((item) => {
            return (
              item?.sectionId == "hEditorTheme" &&
              item?.sectionType == "playlist"
            );
          })}
          row={1}
        />
        <RTChartHome
          data={items.find((item) => {
            return item?.sectionId == "hZC" && item?.sectionType == "RTChart";
          })}
        />
        {/* <WeekChartHome
          data={items.find((item) => {
            return item?.sectionType == "weekChart";
          })}
        /> */}
        <FourItemHome
          data={items.find((item) => {
            return (
              item?.sectionId == "hArtistTheme" &&
              item?.sectionType == "playlist"
            );
          })}
          row={1}
        />
        <FourItemHome
          data={items.find((item) => {
            return item?.sectionId == "h100" && item?.sectionType == "playlist";
          })}
          row={1}
        />
        <FourItemHome
          data={items.find((item) => {
            return (
              item?.sectionId == "hAlbum" && item?.sectionType == "playlist"
            );
          })}
          row={1}
        />
      </SimpleBar>
      <ZingMP3Player />
    </CustomScreen>
  );
}

export default ZingMP3Route;
