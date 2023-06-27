import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { CustomErrorTextForm } from "~/components/CustomError";
import { register as registerReducer } from "~/redux/slices/user";
import { useAppDispatch } from "~/redux/store";
import { UserRegister } from "~/types/mongo/userDB";

type FormDataType = UserRegister & {
  passwordConfirm: string;
};

const scheme: ZodType<FormDataType> = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(6),
  })
  .refine((data) => data.password == data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Password do not match",
  });

function SignUpScheme() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>({ resolver: zodResolver(scheme) });

  function onSubmit(data: FormDataType) {
    const { passwordConfirm, ...rest } = data;
    dispatch(registerReducer(rest));
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1, width: "100%" }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        type="username"
        autoComplete="username"
        autoFocus
        {...register("username", { required: "Username is required" })}
      />
      <CustomErrorTextForm field={errors.username} />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        autoFocus
        {...register("email", { required: "Email is required" })}
      />
      <CustomErrorTextForm field={errors.email} />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        {...register("password", { required: "Password is required" })}
      />
      <CustomErrorTextForm field={errors.password} />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password Confirm"
        type="password"
        id="passwordConfirm"
        autoComplete="current-password"
        {...register("passwordConfirm", {
          required: "Password Confirm is required",
        })}
      />
      <CustomErrorTextForm field={errors.passwordConfirm} />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Sign Up
      </Button>
    </Box>
  );
}

export default SignUpScheme;
