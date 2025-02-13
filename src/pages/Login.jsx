import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { FiEye, FiEyeOff, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form"; // Import React Hook Form
import { useMutation } from "@tanstack/react-query"; // Import useMutation
import { useLocation, useNavigate } from "react-router";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, setTokens, getUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Perform login using data (email, password)
      const response = await login({
        email: data.email,
        password: data.password,
      });
      return response; // Return the response
    },
    onSuccess: (data) => {
      // Set tokens on successful login
      setError();
      setTokens(data.data);
      getUser();

      if (location.pathname === "/login") navigate("/");
    },
    onError: (error) => {
      // Handle login error
      setError(
        error?.response.data.message ||
          "Login failed. Please check your credentials."
      );
    },
  });

  const onSubmit = async (data) => {
    // Trigger the mutation
    mutation.mutate(data);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FiShoppingBag size={40} />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Welcome To Trolley
        </Typography>
        <Box
          component="form"
          sx={{ mt: 3, width: "100%" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            autoComplete="email"
            placeholder="example@mail.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#e41749",
              "&:hover": { bgcolor: "#d4163e" },
            }}
            type="submit"
            disabled={isSubmitting || mutation.isLoading} // Disable when submitting or mutating
          >
            Login
          </Button>

          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Button
                  color="primary"
                  sx={{ p: 0, textTransform: "none" }}
                  href="register"
                >
                  Register
                </Button>
              </Typography>
            </Grid>
            <Grid item>
              <Button color="primary" sx={{ p: 0, textTransform: "none" }}>
                Reset It
              </Button>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
