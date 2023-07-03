import { Avatar, Paper } from "@mui/material";
import { useUserPerson } from "~/hooks/UserPerson";
import { RoomChatResponse } from "~/types/mongo/roomDB";
import { stringAvatar } from "~/utils/Avatar";
import { fromNow } from "~/utils/Extension";

function DetailChatUser(props: { chat: RoomChatResponse }) {
  const { chat } = props;
  const user = useUserPerson(chat.id);

  return (
    <div className="w-full gap-2 items-start flex">
      {chat.received && (
        <Avatar src={user?.base64} {...stringAvatar(user?.username)} />
      )}
      <div
        className={`flex flex-col gap-1 w-full ${
          chat.received ? "items-start" : "items-end"
        }`}
      >
        <div className={`${chat.received ? "text-start" : "text-end"}`}>
          {user?.username}
        </div>
        <Paper className="max-w-[50%]" sx={{ px: 1, py: 0.5 }}>
          {chat.message}
        </Paper>
        <div>{fromNow(chat.createdAt)}</div>
      </div>
      {!chat.received && (
        <Avatar src={user?.base64} {...stringAvatar(user?.username)} />
      )}
    </div>
  );
}

function DetailChat(props: { chats: RoomChatResponse[] }) {
  const { chats } = props;

  return (
    <>
      {chats.map((item, index) => (
        <DetailChatUser key={index} chat={item} />
      ))}
    </>
  );
}

export default DetailChat;
