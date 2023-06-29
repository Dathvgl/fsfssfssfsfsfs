import { Stack, Pagination } from "@mui/material";

type CustomPaginationProps = {
  total: number;
  onPageChange: (page: number) => void;
};

function CustomPagination(props: CustomPaginationProps) {
  const { total, onPageChange } = props;

  return (
    <Stack className="row-center" spacing={2}>
      <Pagination
        count={total}
        variant="outlined"
        color="primary"
        onChange={(_, page) => onPageChange(page)}
      />
    </Stack>
  );
}

export default CustomPagination;
