import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FiEye, FiEyeOff, FiShoppingBag } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth"; // Assuming useAuth provides register function
import { useForm } from "react-hook-form"; // Import React Hook Form
import { useLocation, useNavigate } from "react-router";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch, // watch input values
    formState: { errors, isSubmitting }, // form state and errors
  } = useForm();

  const { register: registerUser, setTokens } = useAuth();

  const mutation = useMutation({
    mutationFn: (data) =>
      registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        addresses: [], // Hardcoded empty array for now
      }),
    onError: (error) => {
      setError(
        error.response.data.message || "Something went wrong. Please try again."
      );
    },
    onSuccess: (data) => {
      // Handle success (e.g., redirect to login or dashboard)
      // Set tokens on successful login
      setTokens(data.data);
      if (location.pathname === "/register") navigate("/");
      alert("Registration successful!");
    },
  });

  const onSubmit = async (data) => {
    // Trigger mutation with form data
    mutation.mutate(data);
  };

  const password = watch("password"); // watch password value

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
          Register on Trolley
        </Typography>
        <Box
          component="form"
          sx={{ mt: 3, width: "100%" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* First Name Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="firstName"
            autoComplete="given-name"
            {...register("firstName", { required: "First name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />

          {/* Last Name Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            {...register("lastName", { required: "Last name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />

          {/* Phone Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone Number"
            name="phone"
            autoComplete="tel"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value:
                  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im,
                message: "Invalid phone number",
              },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          {/* Email Input */}
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

          {/* Password Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
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

          {/* Confirm Password Input */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "The passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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

          {/* Register Button */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#e41749",
              "&:hover": { bgcolor: "#d4163e" },
            }}
            type="submit" // changed onClick to type="submit"
            disabled={isSubmitting || mutation.isLoading} // disable button while submitting or mutating
          >
            {isSubmitting || mutation.isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Register"
            )}
          </Button>

          {/* Optionally show error */}
          {mutation.isError && (
            <Typography color="error" variant="body2">
              {error || "Registration failed. Try again."}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
