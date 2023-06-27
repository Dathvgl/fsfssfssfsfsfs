import { Stack, Pagination } from "@mui/material";

type CustomPaginationProps = {
  total: number;
};

function CustomPagination(props: CustomPaginationProps) {
  const { total } = props;

  return (
    <Stack className="row-center" spacing={2}>
      <Pagination count={total} variant="outlined" color="primary" />
    </Stack>
  );
}

export default CustomPagination;
