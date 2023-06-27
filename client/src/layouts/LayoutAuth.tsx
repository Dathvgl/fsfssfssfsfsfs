import { Alert, Paper } from "@mui/material";
import { ReactNode } from "react";
import { CustomWrap } from "~/components/CustomBox";
import { useAppSelector } from "~/redux/store";

export function LayoutAuth(props: { children: ReactNode }) {
  const { children } = props;
  const { isUser } = useAppSelector((state) => state.user);

  return isUser ? (
    <>{children}</>
  ) : (
    <CustomWrap>
      <div className="h-screen row-center">
        <Paper>
          <Alert severity="error">You must login</Alert>
        </Paper>
      </div>
    </CustomWrap>
  );
}
