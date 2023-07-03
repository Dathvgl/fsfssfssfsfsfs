import { Paper, Alert } from "@mui/material";
import { CustomWrap } from "~/components/CustomBox";

function ErrorRoute() {
  return (
    <CustomWrap>
      <div className="h-screen row-center">
        <Paper>
          <Alert severity="error">Page not found</Alert>
        </Paper>
      </div>
    </CustomWrap>
  );
}

export default ErrorRoute;
