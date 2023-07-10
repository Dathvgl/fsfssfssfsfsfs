import Slider from "react-slick";
import {
  ZingMP3BannerObject,
  ZingMP3BannerSection,
} from "~/types/zingMP3/banner";

function BannerHome(props: { data?: unknown | undefined }) {
  const { data } = props;
  if (!data) return <></>;
  const { items } = data as ZingMP3BannerSection;

  return (
    <Slider
      className="w-full"
      infinite
      centerMode
      speed={500}
      slidesToShow={3}
      slidesToScroll={1}
    >
      {items.map((item, index) => (
        <BannerItem key={index} item={item} />
      ))}
    </Slider>
  );
}

function BannerItem(props: { item: ZingMP3BannerObject }) {
  const { item } = props;

  return (
    <img
      className="rounded-lg w-44 bg-center bg-no-repeat"
      src={item.banner}
      alt="Error"
    />
  );
}

export default BannerHome;
