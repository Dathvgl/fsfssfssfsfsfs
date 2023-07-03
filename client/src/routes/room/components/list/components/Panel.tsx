import { Grid, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/router";
import SimpleBar from "simplebar-react";
import RoomAPI from "~/apis/RoomAPI";
import { useAppSelector } from "~/redux/store";

function ListPanel() {
  const userId = useAppSelector((state) => state.user.user?._id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["room", "user", "list", userId],
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
    <Grid item xs={3}>
      <Paper component={SimpleBar} className="h-64 overflow-hidden">
        {rooms.map((item, index) => (
          <Link key={index} to="/room/$id" params={{ id: item._id }}>
            <div className="px-4 py-2 hover:bg-black hover:bg-opacity-10">
              {item.title}
            </div>
          </Link>
        ))}
      </Paper>
    </Grid>
  );
}

export default ListPanel;
