import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, Paper, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SyntheticEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ZodType, z } from "zod";
import UserAPI from "~/apis/UserAPI";
import CustomBox from "~/components/CustomBox";
import CustomTitle from "~/components/CustomTitle";
import { useUserPerson } from "~/hooks/UserPerson";
import { useAppSelector } from "~/redux/store";
import { UserUpdate } from "~/types/mongo/userDB";
import { stringAvatar } from "~/utils/Avatar";
import { convertBase64 } from "~/utils/Base64";

type Scheme = {
  username: string;
  avatar?: FileList;
};

const scheme: ZodType<Scheme> = z.object({
  username: z.string(),
  avatar: z.instanceof(FileList),
});

function UserProfile() {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.user.user);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  const self = useUserPerson(user?._id);
  const [avatar, setAvatar] = useState<string | undefined>(self?.base64);

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<Scheme>({ resolver: zodResolver(scheme) });

  const { ref: avatarRefRegister, ...restAvatar } = register("avatar", {
    async onChange(event: SyntheticEvent) {
      const input = event.currentTarget as HTMLInputElement;
      if (!input.files) return;
      await convertBase64(input.files[0]).then((item) =>
        setAvatar(() => item as string)
      );
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: UserUpdate) => {
      const res = await UserAPI.putProfile(data);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
    onSuccess: () => {
      toast.success("Updated profile");
      return queryClient.invalidateQueries({
        queryKey: ["user", "person", "alt", user?._id],
      });
    },
  });

  function onSubmit(data: Scheme) {
    if (!user) return;
    const updates: UserUpdate = {};

    if (data.avatar && avatar) {
      const cover = user.relationships.find((item) => item.type == "cover");
      if (cover) updates.cover = { id: cover.id, base64: avatar };
    }

    mutate(updates);
  }

  function onAvatar() {
    avatarRef.current?.click();
  }

  return (
    <CustomBox>
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 divide-x-2 divide-black"
        sx={{ p: 2 }}
      >
        <div className="flex flex-col">
          <input
            ref={(element) => {
              avatarRefRegister(element);
              avatarRef.current = element;
            }}
            className="hidden"
            type="file"
            accept="image/*"
            {...restAvatar}
          />
          <Avatar
            className="cursor-pointer"
            {...stringAvatar(user?.username)}
            onClick={onAvatar}
            src={avatar}
            sx={{ width: 160, height: 160 }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4 pl-4">
          <CustomTitle>Edit profile</CustomTitle>
          <div className="flex flex-col gap-2">
            <div className="font-bold text-lg">Info</div>
            <TextField
              label="Username"
              variant="standard"
              defaultValue={user?.username}
              {...register("username")}
            />
          </div>
          <div>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </Paper>
    </CustomBox>
  );
}

export default UserProfile;
