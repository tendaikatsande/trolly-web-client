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
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
    } else {
      setError("");
      toast.success("Logged in successfully!");
      // Add your login logic here
    }
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
          Welcome To Bazaar
        </Typography>
        <Box component="form" sx={{ mt: 3, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email or Phone Number"
            name="email"
            autoComplete="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
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
            onClick={handleLogin}
          >
            Login
          </Button>
          <Box sx={{ textAlign: "center", my: 2 }}>
            <Typography color="text.secondary">or</Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FaFacebook />}
            sx={{
              mb: 2,
              bgcolor: "#3b5998",
              "&:hover": { bgcolor: "#344e86" },
            }}
          >
            Continue With Facebook
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FaGoogle />}
            sx={{
              mb: 2,
              bgcolor: "#4285f4",
              "&:hover": { bgcolor: "#3367d6" },
            }}
          >
            Continue With Google
          </Button>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Button color="primary" sx={{ p: 0, textTransform: "none" }}>
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
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
