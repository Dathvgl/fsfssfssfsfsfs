import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import TodoAPI from "~/apis/TodoAPI";
import { RelationshipMongo } from "~/types/mongo/mongoDB";

function TodoRelationship(props: {
  callback: (value: string) => void;
  originId?: string;
  relation?: RelationshipMongo;
}) {
  const { callback, originId, relation } = props;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["todo", "relationships"],
    queryFn: async () => {
      const res = await TodoAPI.getTodoRelationships();
      if (res.status != 200) throw new Error();
      return res.data;
    },
  });

  if (isLoading) return <></>;
  if (isError) return <></>;

  const relationships = data;

  if (relationships.length == 0) return <></>;

  return (
    <FormControl>
      <InputLabel id="relationships-label">Relationships</InputLabel>
      <Select
        labelId="relationships-label"
        id="relationships"
        label="Relationships"
        defaultValue={relation?.id || ""}
        onChange={(event) => callback(event.target.value)}
      >
        <MenuItem value={""}>No select</MenuItem>
        {relationships.map((item, index) => {
          if (item._id == originId) return <></>;

          if (item._id == relation?.id)
            return (
              <MenuItem
                key={index}
                value={item._id}
                selected
                sx={{ display: "none" }}
              >
                <div className="flex items-center">
                  <div
                    style={{ backgroundColor: item.color }}
                    className="w-6 h-6 rounded mr-2"
                  />
                  <div>{item.content}</div>
                </div>
              </MenuItem>
            );

          return (
            <MenuItem key={index} value={item._id}>
              <div className="flex items-center">
                <div
                  style={{ backgroundColor: item.color }}
                  className="w-6 h-6 rounded mr-2"
                />
                <div>{item.content}</div>
              </div>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default TodoRelationship;
