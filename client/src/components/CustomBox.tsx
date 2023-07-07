import { Box, Toolbar, Container } from "@mui/material";
import { ReactNode } from "react";
import SimpleBar from "simplebar-react";

export function CustomWrap(props: { children?: ReactNode }) {
  const { children } = props;

  return (
    <Box
      component={SimpleBar}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
}

export function CustomScreen(props: { children?: ReactNode }) {
  const { children } = props;

  return <CustomWrap>
    <div className="flex flex-col w-full h-screen">
      <Toolbar />
      {children}
    </div>
  </CustomWrap>;
}

function CustomBox(props: { children?: ReactNode }) {
  const { children } = props;

  return (
    <CustomWrap>
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </CustomWrap>
  );
}

export default CustomBox;
