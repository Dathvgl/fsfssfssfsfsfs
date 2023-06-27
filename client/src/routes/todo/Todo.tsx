import { Grid } from "@mui/material";
import CustomBox from "~/components/CustomBox";
import TodoAdd from "./components/Add";
import TodoList from "./components/List/List";

function TodoRoute() {
  return (
    <CustomBox>
      <Grid container spacing={3}>
        <TodoAdd />
        <TodoList />
      </Grid>
    </CustomBox>
  );
}

export default TodoRoute;
