import { zodResolver } from "@hookform/resolvers/zod";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, InputBase, Paper, Toolbar } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SimpleBar from "simplebar-react";
import { ZodType, z } from "zod";
import RoomAPI from "~/apis/RoomAPI";
import { CustomWrap } from "~/components/CustomBox";
import CustomUserDot from "~/components/CustomUserDot/CustomUserDot";
import { useAppSelector } from "~/redux/store";
import { RoomChatResponse } from "~/types/mongo/roomDB";
import { socket } from "~/utils/Socket";
import { nowISO } from "~/utils/date";
import DetailChat from "./components/Chat";
import RoomPanel from "./components/Panel";

type RoomType = { message: string };

const scheme: ZodType<RoomType> = z.object({
  message: z.string(),
});

function RoomDetailValid({ id }: { id?: string }) {
  const user = useAppSelector((state) => state.user.user);

  const [connect, setConnect] = useState(false);
  const [chats, setChats] = useState<RoomChatResponse[]>([]);
  const [typing, setTyping] = useState(false);

  const [inputTime, setInputTime] = useState<NodeJS.Timeout>();

  const { register, handleSubmit, reset } = useForm<RoomType>({
    resolver: zodResolver(scheme),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["room", "detail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await RoomAPI.getRoom(id);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["room", "chats", id],
    mutationFn: async (data: string) => {
      if (!id) return null;
      const res = await RoomAPI.putRoomChat(id, data);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  useEffect(() => {
    socket.connect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.emit("roomJoinClient", id);

    socket.on("typingMessageServer", onTyping);
    socket.on("sendMessageServer", onMessage);

    return () => {
      socket.emit("roomLeaveClient", id);

      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      socket.off("typingMessageServer", onTyping);
      socket.off("sendMessageServer", onMessage);

      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (data) {
      const array: RoomChatResponse[] = [];
      data.chats.forEach((item) => {
        array.push(item);
      });

      setChats(() => array);
    }
  }, [data?.chats]);

  function onConnect() {
    setConnect(() => true);
  }

  function onDisconnect() {
    setConnect(() => false);
  }

  function onTyping(typing: boolean) {
    setTyping(() => typing);
  }

  function onMessage(message: string) {
    setChats((state) => [
      ...state,
      {
        id: user?._id,
        message,
        received: true,
        createdAt: nowISO(),
      },
    ]);
  }

  function onSubmit(data: RoomType) {
    reset();

    const { message } = data;
    socket.emit("sendMessageClient", message);
    mutate(message);

    setChats((state) => [
      ...state,
      {
        id: user?._id,
        message,
        received: false,
        createdAt: nowISO(),
      },
    ]);
  }

  if (!connect) return <></>;
  if (isLoading) return <></>;
  if (isError || !data) return <></>;

  return (
    <CustomWrap>
      <div className="flex flex-col w-full h-screen">
        <Toolbar />
        <Paper
          className="flex-1 flex gap-4 divide-x-2 divide-black"
          sx={{ p: 2 }}
        >
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex justify-between">
              <div className="font-bold text-2xl">{data.title}</div>
              <Button variant="contained">Leave</Button>
            </div>
            <br />
            <SimpleBar className="flex-1 p-2 bg-slate-400 flex flex-col gap-2 overflow-auto border border-black rounded">
              <DetailChat chats={chats} />
              {typing && <CustomUserDot />}
            </SimpleBar>
            <br />
            <Box
              className="flex items-center gap-4"
              component="form"
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <InputBase
                className="border flex-1 border-black px-2 rounded"
                placeholder="Message"
                {...register("message", {
                  onChange(_) {
                    socket.emit("typingMessageClient", { id, typing: true });

                    if (inputTime) clearTimeout(inputTime);

                    setInputTime(
                      setTimeout(() => {
                        socket.emit("typingMessageClient", {
                          id,
                          typing: false,
                        });
                      }, 500)
                    );
                  },
                })}
              />
              <Button
                sx={{ px: 1.5, py: 0.5 }}
                type="submit"
                variant="contained"
                startIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          </div>
          <RoomPanel id={id} />
        </Paper>
      </div>
    </CustomWrap>
  );
}

function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.user.user?._id);

  const { isLoading, isError } = useQuery({
    queryKey: ["room", "detail", "valid", id, userId],
    queryFn: async () => {
      if (!id) return false;
      const res = await RoomAPI.postRoomValid(id);
      if (!res || res.status != 200) {
        navigate({ to: "/room" });
        return false;
      } else return true;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  if (isLoading) return <></>;
  if (isError) return <></>;

  return <RoomDetailValid id={id} />;
}

export default RoomDetail;
