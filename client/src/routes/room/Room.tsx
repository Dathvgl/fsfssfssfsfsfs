import CustomBox from "~/components/CustomBox";
import { useAppSelector } from "~/redux/store";
import RoomAdd from "./components/Add";
import RoomList from "./components/list/List";

function RoomRoute() {
  const { isUser } = useAppSelector((state) => state.user);

  return (
    <CustomBox>
      {isUser && <RoomAdd />}
      <RoomList />
    </CustomBox>
  );
}

export default RoomRoute;
