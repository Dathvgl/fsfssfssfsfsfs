import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/router";
import SimpleBar from "simplebar-react";
import RoomAPI from "~/apis/RoomAPI";

function RoomPanel({ id }: { id?: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["room", "user", "list"],
    queryFn: async () => {
      const res = await RoomAPI.getRoomsUser();
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  const rooms = data;
  if (rooms.length == 0) return <></>;

  return (
    <SimpleBar className="w-60 h-full pl-4 overflow-hidden">
      {rooms.map((item, index) => {
        const exact = id == item._id;
        return (
          <Link
            key={index}
            to="/room/$id"
            params={{ id: item._id }}
            disabled={exact}
          >
            <div
              className={`px-4 py-2 ${
                exact
                  ? "bg-black bg-opacity-10"
                  : "hover:bg-black hover:bg-opacity-10"
              }`}
            >
              {item.title}
            </div>
          </Link>
        );
      })}
    </SimpleBar>
  );
}

export default RoomPanel;
