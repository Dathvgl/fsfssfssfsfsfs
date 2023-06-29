import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import TodoAPI from "~/apis/TodoAPI";
import { CustomErrorTextForm } from "~/components/CustomError";
import CustomModalFloat from "~/components/CustomModalFloat";
import { RelationshipMongo } from "~/types/mongo/mongoDB";
import {
  TodoInfo,
  TodoPriority,
  TodoProgress,
  TodoScheme,
} from "~/types/mongo/todoDB";
import { capitalize } from "~/utils/Extension";
import TodoRelationship from "./Relationship";

const priorities: TodoPriority[] = ["low", "medium", "high", "critical"];

const progresses: TodoProgress[] = [
  undefined,
  "constant",
  "to do",
  "in progress",
  "done",
];

const scheme: ZodType<TodoScheme> = z.object({
  content: z.string().trim().min(3),
  color: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  progress: z.enum(["constant", "to do", "in progress", "done"]).optional(),
});

function TodoAdd() {
  const queryClient = useQueryClient();
  const [weeks, setWeeks] = useState<string[]>([]);
  const [relationship, setRelationship] = useState<RelationshipMongo>();

  const { mutate } = useMutation({
    mutationFn: async (data: TodoInfo) => {
      const res = await TodoAPI.postTodo(data);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoScheme>({ resolver: zodResolver(scheme) });

  function onSubmit(data: TodoScheme) {
    mutate({ ...data, relationship, todos: [] });
  }

  return (
    <CustomModalFloat icon={<AddIcon />}>
      <div className="w-96">
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            id="standard-basic"
            label="Todo"
            variant="standard"
            sx={{ flex: 1 }}
            {...register("content", { required: "Content is required" })}
          />
          <CustomErrorTextForm field={errors.content} />
          <div className="gap-4 row-between">
            <Controller
              name="color"
              control={control}
              render={({ field: { value } }) => (
                <TextField
                  disabled
                  id="standard-basic"
                  label="Color"
                  variant="standard"
                  sx={{ flex: 1 }}
                  value={value || ""}
                />
              )}
            />
            <input
              className="border rounded w-10 h-8 p-1"
              defaultValue="#ffffff"
              type="color"
              {...register("color")}
            />
          </div>
          <div className="gap-4 row-between">
            <FormControl className="flex-1">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Controller
                name="priority"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    labelId="priority-label"
                    id="priority"
                    label="Priority"
                    value={value || ""}
                    onChange={(event) => {
                      const value: string = event.target.value;
                      if (!value) onChange(undefined);
                      else onChange(value as TodoPriority);
                    }}
                  >
                    <MenuItem value={""}>No select</MenuItem>
                    {priorities.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {capitalize(item)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl className="flex-1">
              <InputLabel id="progress-label">Progress</InputLabel>
              <Controller
                name="progress"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select
                    labelId="progress-label"
                    id="progress"
                    label="Progress"
                    value={value || ""}
                    onChange={(event) => {
                      const value: string = event.target.value;
                      if (!value) onChange(undefined);
                      else onChange(value as TodoProgress);
                    }}
                  >
                    <MenuItem value={""}>No select</MenuItem>
                    {progresses.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {capitalize(item)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </div>
          <ButtonGroup variant="outlined">
            {Array(6)
              .fill(0)
              .map((_, index) => {
                const str = `T${index + 2}`;
                const check = weeks.includes(str);

                return (
                  <Button
                    key={index}
                    color={`${check ? "secondary" : "primary"}`}
                    onClick={() => {
                      if (!check) setWeeks(() => [...weeks, str]);
                      else setWeeks([...weeks.filter((item) => item != str)]);
                    }}
                  >
                    {str}
                  </Button>
                );
              })}
          </ButtonGroup>
          <TodoRelationship
            callback={(value) => {
              if (!value) setRelationship(() => undefined);
              else setRelationship(() => ({ id: value, type: "todo" }));
            }}
          />
          <Button type="submit" variant="contained">
            Add
          </Button>
        </form>
      </div>
    </CustomModalFloat>
  );
}

export default TodoAdd;
