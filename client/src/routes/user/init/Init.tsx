import { ButtonBase } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import PasswordScheme from "./schemes/Password";
import SignInScheme from "./schemes/SignIn";
import SignUpScheme from "./schemes/SignUp";

type InitType = "signIn" | "signUp" | "password";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        fsfssfssfsfsfs
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function UserInit(props: { drawerFn: () => void }) {
  const { drawerFn } = props;

  const [initType, setInitType] = useState<InitType>("signIn");

  function onInitType(type: InitType) {
    setInitType(() => type);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid item xs={12} component={Paper} square>
          <div className="flex flex-col items-center px-8 pb-8 pt-24 min-[600px]:w-96">
            <Typography
              className="cursor-pointer italic select-none hover:text-red-700"
              component="h1"
              variant="h3"
              sx={{ fontWeight: "bold" }}
              onClick={() => drawerFn()}
            >
              fsfssfssfsfsfs
            </Typography>
            <Typography component="h1" variant="h5">
              {initType == "signIn" && "Sign in"}
              {initType == "signUp" && "Sign up"}
              {initType == "password" && "Forgot password"}
            </Typography>
            {initType == "signIn" && <SignInScheme />}
            {initType == "signUp" && <SignUpScheme />}
            {initType == "password" && <PasswordScheme />}
            <Grid container>
              <Grid item xs>
                <ButtonBase
                  className="text-sm"
                  sx={{ px: 1, py: 0.5, color: "#1976d2" }}
                  onClick={() => onInitType("password")}
                >
                  Forgot password?
                </ButtonBase>
              </Grid>
              <Grid item>
                <ButtonBase
                  className="text-sm"
                  sx={{ px: 1, py: 0.5, color: "#1976d2" }}
                  onClick={() =>
                    onInitType(
                      initType == "signIn"
                        ? "signUp"
                        : initType == "signUp"
                        ? "signIn"
                        : "signIn"
                    )
                  }
                >
                  {initType == "signIn" && "Don't have an account?"}
                  {(initType == "signUp" || initType == "password") &&
                    "Already have an account?"}
                </ButtonBase>
              </Grid>
            </Grid>
            <br />
            <Copyright />
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default UserInit;
