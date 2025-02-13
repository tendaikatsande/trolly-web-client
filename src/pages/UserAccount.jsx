import { Box, Typography, Divider } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import AddressManager from "../components/AddressManager";

const UserAccount = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">User not logged in</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        User Account
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6">Personal Information</Typography>
      <Typography variant="body1">
        <strong>First Name:</strong> {user.firstName}
      </Typography>
      <Typography variant="body1">
        <strong>Last Name:</strong> {user.lastName}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {user.email}
      </Typography>
      <Typography variant="body1">
        <strong>Phone:</strong> {user.phone}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <AddressManager user={user} />
    </Box>
  );
};

export default UserAccount;
