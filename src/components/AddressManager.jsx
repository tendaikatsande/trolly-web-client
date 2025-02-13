import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAddress,
  deleteAddress,
  updateAddress,
} from "../services/UserService";
import { useAuth } from "../hooks/useAuth";

// Styled Components
const AddressCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  border: `1px solid ${theme.palette.divider}`,
  transition: "border-color 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

// Initial state for a new address
const initialAddressState = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  default: false,
};

const AddressManager = ({ user, onAddressSelect }) => {
  const queryClient = useQueryClient();
  const { getUser } = useAuth();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [addressForm, setAddressForm] = useState(initialAddressState);

  useEffect(() => {
    setAddressForm(initialAddressState);
  }, [user]);

  // Mutation hooks
  const addMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]); // Refresh user data
      handleClose();
      queryClient.invalidateQueries(["user"]);
      getUser();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      handleClose();
      queryClient.invalidateQueries(["user"]);
      getUser();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["user"]);
      getUser();
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAddressForm(initialAddressState);
    setEditMode(false);
  };

  const handleChange = (e) => {
    setAddressForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddOrEditAddress = () => {
    if (
      !addressForm.addressLine1 ||
      !addressForm.city ||
      !addressForm.postalCode
    )
      return;

    if (editMode) {
      updateMutation.mutate(addressForm);
    } else {
      addMutation.mutate(addressForm);
    }
  };

  const handleEditAddress = (address) => {
    setEditMode(true);
    setAddressForm(address);
    setOpen(true);
  };

  const handleDeleteAddress = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Addresses</Typography>
        <Fab color="primary" aria-label="add" size="small" onClick={handleOpen}>
          <FiPlus />
        </Fab>
      </Box>

      <Grid container spacing={2}>
        {user?.addresses?.length > 0 ? (
          user.addresses.map((address, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <AddressCard
                onClick={() => onAddressSelect && onAddressSelect(address)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1">
                      Address {index + 1} {address.default && "(Default)"}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditAddress(address)}
                      >
                        <FiEdit2 />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {address.addressLine1}
                  </Typography>
                  {address.addressLine2 && (
                    <Typography variant="body2" color="text.secondary">
                      {address.addressLine2}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {address.city}, {address.state} {address.postalCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address.country}
                  </Typography>
                </CardContent>
              </AddressCard>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No addresses available.</Typography>
        )}
      </Grid>

      {/* Address Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editMode ? "Edit Address" : "Add New Address"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {[
              "addressLine1",
              "addressLine2",
              "city",
              "state",
              "postalCode",
              "country",
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  margin="dense"
                  name={field}
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  type="text"
                  fullWidth
                  value={addressForm[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAddOrEditAddress}
            color="primary"
            disabled={addMutation.isPending || updateMutation.isPending}
          >
            {editMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressManager;
