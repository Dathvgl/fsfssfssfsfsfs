import { Avatar } from "@mui/material";
import { useUserPerson } from "~/hooks/UserPerson";
import { useAppSelector } from "~/redux/store";
import { stringAvatar } from "~/utils/Avatar";

function ActionsAvatar() {
  const user = useAppSelector((state) => state.user.user);
  const self = useUserPerson(user?._id);
  return <Avatar src={self?.base64} {...stringAvatar(self?.username)} />;
}

export default ActionsAvatar;
