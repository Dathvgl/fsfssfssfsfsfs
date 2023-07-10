type WeekChartType = {
  banner: string;
  country: string;
  cover: string;
  endDate: string;
  //   group: [];
  link: string;
  startDate: string;
  type: string;
};

function WeekChartHome(props: { data?: unknown | undefined }) {
  const { data } = props;
  if (!data) return <></>;
  const { items } = data as { items: WeekChartType[] };

  return (
    <>
      <div className="mt-9">
        <div className="grid grid-cols-3 gap-4">
          {items?.map((item, index) => (
            <div key={index} className="w-full rounded-lg overflow-hidden">
              <img
                className="scale-100 hover:scale-110 ease-in duration-500"
                src={item.cover}
                alt="Error"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default WeekChartHome;
