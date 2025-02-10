import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useCart } from "../hooks/useCart";

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: "#e41749",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  1
                </Box>
                <Typography variant="h6">Delivery Date and Time</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label="Delivery Date"
                    value={selectedDate}
                    onChange={(newValue) => {
                      setSelectedDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    label="Delivery Time"
                    value={selectedTime}
                    onChange={(newValue) => {
                      setSelectedTime(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth size="small" />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "#e41749",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="h6">Delivery Address</Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FiPlus />}
                >
                  Add New Address
                </Button>
              </Box>
              <Grid container spacing={2}>
                {["Home", "Office", "Office 2"].map((type) => (
                  <Grid item xs={12} sm={6} md={4} key={type}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: "pointer",
                        bgcolor:
                          selectedAddress === type
                            ? "action.selected"
                            : "background.paper",
                      }}
                      onClick={() => setSelectedAddress(type)}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1">{type}</Typography>
                          <Box>
                            <IconButton size="small">
                              <FiEdit2 />
                            </IconButton>
                            <IconButton size="small">
                              <FiTrash2 />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          375 Subidbazaar, MA 2351
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          +1780 408 4466
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    bgcolor: "#e41749",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  3
                </Box>
                <Typography variant="h6">Payment Details</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Name on Card" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Card Number" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Expiry Date" />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="CVC" />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Save this card"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your Order
              </Typography>
              <Box sx={{ mb: 2 }}>
                {cart.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>
                      {item.quantity} x {item.name}
                    </Typography>
                    <Typography>${item.price.toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ "& > div": { mb: 1 } }}>
                {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${cartTotal}</Typography>
                </Box> */}
                {/* <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Tax:</Typography>
                  <Typography>$40.00</Typography>
                </Box> */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">Total:</Typography>
                  <Typography variant="subtitle1">${cartTotal}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Checkout;
