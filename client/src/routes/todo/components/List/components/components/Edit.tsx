import { zodResolver } from "@hookform/resolvers/zod";
import { Build } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { CustomErrorTextForm } from "~/components/CustomError";
import { RelationshipMongo } from "~/types/mongo/mongoDB";
import {
  TodoInfo,
  TodoMongo,
  TodoPriority,
  TodoProgress,
  TodoScheme,
} from "~/types/mongo/todoDB";
import { capitalize } from "~/utils/Extension";
import TodoRelationship from "../../../Relationship";

const style: SxProps<Theme> | undefined = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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

function ItemEdit(props: {
  item: TodoMongo;
  callback: (value: TodoInfo) => void;
}) {
  const { item, callback } = props;
  const relation = item.relationships.find((item) => item.type == "todo");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [weeks, setWeeks] = useState<string[]>(item.weeks || []);
  const [relationship, setRelationship] = useState<
    RelationshipMongo | undefined
  >(relation);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TodoScheme>({ resolver: zodResolver(scheme) });

  function onSubmit(data: TodoScheme) {
    const todo: TodoInfo = { ...data, relationship, todos: [] };
    Object.keys(todo).forEach((key) => {
      const prop = key as keyof typeof todo;
      if (prop == "relationship") {
        const relate = todo[prop];
        item.relationships.forEach(({ id, type }) => {
          if (type == "todo" && id == relate.id) delete todo[prop];
        });
      } else {
        if (todo[prop] == item[prop]) delete todo[prop];
      }
    });

    callback(todo);
  }

  return (
    <>
      <IconButton color="primary" aria-label="Edit" onClick={handleOpen}>
        <Build />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="w-96">
              <form
                className="w-full flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <TextField
                  id="standard-basic"
                  label="Todo"
                  variant="standard"
                  defaultValue={item.content}
                  sx={{ flex: 1 }}
                  {...register("content", { required: "Content is required" })}
                />
                <CustomErrorTextForm field={errors.content} />
                <div className="gap-4 row-between">
                  <Controller
                    name="color"
                    control={control}
                    defaultValue={item.color || ""}
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
                    defaultValue={item.color || "#ffffff"}
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
                      defaultValue={item.priority}
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
                      defaultValue={item.progress}
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
                            else
                              setWeeks([
                                ...weeks.filter((item) => item != str),
                              ]);
                          }}
                        >
                          {str}
                        </Button>
                      );
                    })}
                </ButtonGroup>
                <TodoRelationship
                  originId={item._id}
                  relation={relation}
                  callback={(value) => {
                    if (!value) setRelationship(() => undefined);
                    else setRelationship(() => ({ id: value, type: "todo" }));
                  }}
                />
                <Button type="submit" variant="contained">
                  Update
                </Button>
              </form>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default ItemEdit;
