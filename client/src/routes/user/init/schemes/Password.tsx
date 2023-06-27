import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { CustomErrorTextForm } from "~/components/CustomError";

type FormDataType = {
  email: string;
  password: string;
};

const scheme: ZodType<FormDataType> = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function PasswordScheme() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataType>({ resolver: zodResolver(scheme) });

  function onSubmit(data: FormDataType) {
    const email = data.email;
    const password = data.password;
    console.log(email, password);
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
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Reset password
      </Button>
    </Box>
  );
}

export default PasswordScheme;
