import { Delete } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TodoAPI from "~/apis/TodoAPI";
import { TodoInfo, TodoMongo } from "~/types/mongo/todoDB";
import { capitalize, fromNow } from "~/utils/Extension";
import ItemEdit from "./components/Edit";

type ActionType = "edit" | "delete";
type MutateType = {
  type: ActionType;
  data?: TodoInfo;
};

function ListItem(props: { item: TodoMongo }) {
  const { item } = props;
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async ({ type, data }: MutateType) => {
      if (type == "edit" && data) {
        const res = await TodoAPI.putTodo(item._id, data);
        if (res.status != 200) throw new Error();
        return res.data;
      }

      const res = await TodoAPI.deleteTodo(item._id, item.todos.length);
      if (res.status != 200) throw new Error();
      return res.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  function onAction(type: ActionType, data?: TodoInfo) {
    mutate({ type, data });
  }

  return (
    <Grid
      container
      className="items-center px-2 py-1 rounded border border-black"
    >
      <Grid item xs={12} md>
        <div className="flex-1 gap-4 row-between">
          <div
            style={{ backgroundColor: item.color }}
            className="w-6 h-6 rounded"
          />
          <div className="flex-1">{item.content}</div>
        </div>
      </Grid>
      <Grid item xs={6} md={2}>
        {capitalize(item.priority)}
      </Grid>
      <Grid item xs={6} md={2}>
        {capitalize(item.progress)}
      </Grid>
      <Grid item xs={6} md={2}>
        {capitalize(fromNow(item.createdAt))}
      </Grid>
      <Grid item xs={6} md={2}>
        {capitalize(fromNow(item.updatedAt))}
      </Grid>
      <Grid item>
        <ItemEdit item={item} callback={(value) => onAction("edit", value)} />
        <IconButton
          color="secondary"
          aria-label="Delete"
          onClick={() => onAction("delete")}
        >
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default ListItem;
