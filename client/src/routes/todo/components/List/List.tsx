import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  List,
  Paper,
  Skeleton
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react";
import TodoAPI from "~/apis/TodoAPI";
import CustomTitle from "~/components/CustomTitle";
import ListItem from "./components/Item";

function TodoList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["todo"],
    queryFn: async () => {
      const res = await TodoAPI.getTodos();
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  if (isLoading)
    return (
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Skeleton height={50} variant="rounded" />
        </Paper>
      </Grid>
    );

  if (isError) return <></>;

  const todos = data.data;

  if (todos.length == 0) return <></>;

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2 }}>
        <CustomTitle>List Todo</CustomTitle>
        <List>
          {todos?.map((item, index) => (
            <Fragment key={index}>
              {item.todos.length == 0 ? (
                <ListItem item={item} />
              ) : (
                <Accordion>
                  <AccordionSummary>
                    <ListItem item={item} />
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {item.todos.map((item, index) => (
                        <ListItem key={index} item={item} />
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </Fragment>
          ))}
        </List>
      </Paper>
    </Grid>
  );
}

export default TodoList;
