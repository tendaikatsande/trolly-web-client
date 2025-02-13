import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useCart } from "../hooks/useCart";
import { placeOrder } from "../services/OrderService";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddressManager from "../components/AddressManager";
import { useAuth } from "../hooks/useAuth";

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("paynow");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [address, setAddress] = useState();
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      deliveryDate: null,
      deliveryTime: null,
    },
  });

  const queryClient = useQueryClient();

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries("orders");
      // Handle success (e.g., show success message, redirect)
    },
    onError: (error) => {
      console.error("Error placing order:", error);
    },
  });

  const onSubmit = (data) => {
    const orderPayload = {
      userId: user.id,
      status: "pending", // Initial status
      totalAmount: cartTotal,
      createdAt: new Date().toISOString(),
      items: cart.map((item) => ({
        id: item.id,
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress:
        deliveryMethod === "delivery"
          ? {
              id: address.id,
              fullName: user.firstName + " " + user.lastName,
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2 || "",
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
              phone: address.phone,
            }
          : null,
      paymentMethod: paymentMethod,
      ...(deliveryMethod === "delivery" && {
        deliveryDate: data.deliveryDate?.toISOString() || null,
        deliveryTime: data.deliveryTime?.toISOString() || null,
      }),
    };
    localStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
    placeOrderMutation.mutate(orderPayload);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6">Delivery Method</Typography>
                <RadioGroup
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="delivery"
                    control={<Radio />}
                    label="Delivery"
                  />
                  <FormControlLabel
                    value="pickup"
                    control={<Radio />}
                    label="Pickup"
                  />
                </RadioGroup>
              </Paper>

              {deliveryMethod === "delivery" && (
                <>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography variant="h6">
                        Delivery Date and Time
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Controller
                          name="deliveryDate"
                          control={control}
                          rules={{ required: "Delivery date is required" }}
                          render={({ field }) => (
                            <DatePicker
                              label="Delivery Date"
                              {...field}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={!!errors.deliveryDate}
                                  helperText={errors.deliveryDate?.message}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Controller
                          name="deliveryTime"
                          control={control}
                          rules={{ required: "Delivery time is required" }}
                          render={({ field }) => (
                            <TimePicker
                              label="Delivery Time"
                              {...field}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  size="small"
                                  error={!!errors.deliveryTime}
                                  helperText={errors.deliveryTime?.message}
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6">Delivery Address</Typography>
                    {/* Include AddressManager here */}
                    <AddressManager user={user} onAddressSelect={setAddress} />
                  </Paper>
                </>
              )}

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Payment Details</Typography>
                <RadioGroup
                  aria-label="paymentMethod"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="paynow"
                    control={<Radio />}
                    label="PayNow"
                  />
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
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
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1">Total:</Typography>
                    <Typography variant="subtitle1">${cartTotal}</Typography>
                  </Box>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={placeOrderMutation.isLoading}
                >
                  {placeOrderMutation.isLoading
                    ? "Placing Order..."
                    : "Place Order"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </Container>
    </LocalizationProvider>
  );
};

export default Checkout;
