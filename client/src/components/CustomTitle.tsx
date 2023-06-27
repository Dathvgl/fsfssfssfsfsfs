import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface TitleProps {
  children?: ReactNode;
}

function CustomTitle(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

export default CustomTitle;
