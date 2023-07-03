import { Button, Grid, Paper } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RoomAPI from "~/apis/RoomAPI";
import { useAppSelector } from "~/redux/store";
import ListPanel from "~/routes/room/components/list/components/Panel";
import { capitalize } from "~/utils/Extension";

function RoomList() {
  const { isUser } = useAppSelector((state) => state.user);
  const userId = useAppSelector((state) => state.user.user?._id);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["room", isUser, userId],
    queryFn: async () => {
      const res = await RoomAPI.getRooms();
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      const res = await RoomAPI.putRoomUserJoin(id);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["room", "user", "list"],
      });
    },
  });

  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  const { data: rooms } = data;

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper sx={{ p: 2 }}>
          {rooms.length == 0 && <>No data</>}
          {rooms.map((item, index) => (
            <div key={index} className="gap-4 row-between">
              <div className="gap-4 flex-1 row-between">
                <div className="flex-1">{item.title}</div>
                <div className="w-32">{capitalize(item.access)} room</div>
              </div>
              <Button variant="contained" onClick={() => mutate(item._id)}>
                Join
              </Button>
            </div>
          ))}
        </Paper>
      </Grid>
      {isUser && <ListPanel />}
    </Grid>
  );
}

export default RoomList;
