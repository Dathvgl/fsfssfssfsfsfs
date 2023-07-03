import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import RoomAPI from "~/apis/RoomAPI";
import { CustomErrorTextForm } from "~/components/CustomError";
import CustomModalFloat from "~/components/CustomModalFloat";
import { RoomAccess, RoomInit } from "~/types/mongo/roomDB";
import { capitalize } from "~/utils/Extension";

const accesses: RoomAccess[] = ["public", "private"];

const scheme: ZodType<RoomInit> = z.object({
  title: z.string().trim().min(3),
  access: z.enum(["public", "private"]),
});

function RoomAdd() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (data: RoomInit) => {
      const res = await RoomAPI.postRoom(data);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["room"] });
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomInit>({ resolver: zodResolver(scheme) });

  function onSubmit(data: RoomInit) {
    mutate(data);
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
            label="Room name"
            variant="standard"
            sx={{ flex: 1 }}
            {...register("title", { required: "Content is required" })}
          />
          <CustomErrorTextForm field={errors.title} />
          <FormControl className="flex-1">
            <InputLabel id="access-label">Access</InputLabel>
            <Controller
              name="access"
              defaultValue="public"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  labelId="access-label"
                  id="access"
                  label="Access"
                  value={value}
                  onChange={(event) => {
                    const value: string = event.target.value;
                    onChange(value as RoomAccess);
                  }}
                >
                  {accesses.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {capitalize(item)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <Button type="submit" variant="contained">
            Add
          </Button>
        </form>
      </div>
    </CustomModalFloat>
  );
}

export default RoomAdd;
