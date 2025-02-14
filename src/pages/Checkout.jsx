import { useState, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useCart } from "../hooks/useCart";
import { placeOrder } from "../services/OrderService";
import {
  useForm,
  Controller,
  useFormContext,
  FormProvider,
} from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddressManager from "../components/AddressManager";
import { useAuth } from "../hooks/useAuth";
import { isValid, isPast, addHours, isSameDay } from "date-fns"; // Added isSameDay
import { useNavigate } from "react-router";
import Login from "./Login";

// Enhanced AddressManager Component (Illustrative)
const EnhancedAddressManager = ({ user, onAddressSelect }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Use form context

  return (
    <Box>
      <Typography variant="subtitle1">Select Address:</Typography>
      <AddressManager user={user} onAddressSelect={onAddressSelect} />
      {/* Example: Assume AddressManager internally uses fields like addressLine1, city, etc. */}
      {/* Adjust names and error messages accordingly to match your actual AddressManager implementation */}
      {/* <Controller
        name="addressLine1"
        control={control}
        rules={{ required: "Address Line 1 is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Address Line 1"
            error={!!errors.addressLine1}
            helperText={errors.addressLine1?.message}
            fullWidth
            margin="normal"
          />
        )}
      /> */}
      {/* Add similar Controller components for other address fields (city, state, postalCode, etc.) */}
    </Box>
  );
};

const Checkout = () => {
  const { cart, cartTotal, emptyCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("paynow");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [address, setAddress] = useState(null);
  const { user } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      deliveryDate: null,
      deliveryTime: null,
      // Initialize other fields with default values as needed
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = methods;

  const deliveryDateValue = watch("deliveryDate");
  const deliveryTimeValue = watch("deliveryTime");

  useEffect(() => {
    trigger(["deliveryDate", "deliveryTime"]);
  }, [deliveryDateValue, deliveryTimeValue, trigger]);

  const queryClient = useQueryClient();

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries("orders");
      emptyCart();
      setAlertType("success");
      setAlertMessage("Order placed successfully!");
      setShowAlert(true);
      navigate(`/order/${data.id}`); // Redirect to order confirmation
    },
    onError: (error) => {
      console.error("Error placing order:", error);
      setAlertType("error");
      setAlertMessage(`Error placing order: ${error.message}`);
      setShowAlert(true);
    },
  });

  const isFutureDateTime = (date, time) => {
    if (!date || !time || !isValid(date) || !isValid(time)) {
      return false;
    }

    if (isPast(date)) {
      return false; // Date is in the past
    }

    const combinedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );

    const now = new Date();
    let futureTime = addHours(now, 1); // Add 1 hour

    // If the selected date is the same as today, ensure the time is at least 1 hour in the future
    if (isSameDay(date, now) && combinedDateTime <= futureTime) {
      return false;
    }

    return combinedDateTime > futureTime;
  };

  const deliveryDateTimeValidator = (value, formValues) => {
    const deliveryDate = formValues.deliveryDate;
    const deliveryTime = formValues.deliveryTime;

    if (!deliveryDate || !deliveryTime) {
      return true;
    }

    if (!isFutureDateTime(deliveryDate, deliveryTime)) {
      return "Delivery time must be at least 1 hour in the future.";
    }

    return true;
  };

  const shouldDisableDate = (date) => {
    return isPast(date);
  };

  const shouldDisableTime = (date, view) => {
    if (view === "hours" || view === "minutes") {
      const now = new Date();
      let futureTime = addHours(now, 1);

      if (isSameDay(date, now)) {
        return date.getTime() < futureTime.getTime();
      }
    }
    return false;
  };

  const onSubmit = (data) => {
    if (!user) {
      setAlertType("warning");
      setAlertMessage("Please log in to place your order.");
      setShowAlert(true);
      return;
    }

    if (!user.email) {
      setAlertType("warning");
      setAlertMessage(
        "Your account does not have an email address. Please update your profile."
      );
      setShowAlert(true);
      return;
    }

    const isValidDateTime = isFutureDateTime(
      data.deliveryDate,
      data.deliveryTime
    );
    if (!isValidDateTime) {
      setAlertType("warning");
      setAlertMessage("Delivery time must be at least 1 hour in the future.");
      setShowAlert(true);
      return;
    }

    if (!address) {
      setAlertType("warning");
      setAlertMessage("Please select a delivery address.");
      setShowAlert(true);
      return;
    }

    const orderPayload = {
      userId: user.id,
      status: "pending",
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
              id: address?.id,
              fullName: user.firstName + " " + user.lastName,
              addressLine1: address?.addressLine1,
              addressLine2: address?.addressLine2 || "",
              city: address?.city,
              state: address?.state,
              postalCode: address?.postalCode,
              country: address?.country,
              phone: address?.phone,
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
        {showAlert && (
          <Alert
            severity={alertType}
            onClose={() => setShowAlert(false)}
            sx={{ mb: 2 }}
          >
            {alertMessage}
          </Alert>
        )}
        {!user?.email ? (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Login to Checkout
            </Typography>
            <Login />
          </Paper>
        ) : (
          <FormProvider {...methods}>
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 3 }}
                        >
                          <Typography variant="h6">
                            Delivery Date and Time
                          </Typography>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Controller
                              name="deliveryDate"
                              control={control}
                              rules={{
                                required: "Delivery date is required",
                                validate: deliveryDateTimeValidator,
                              }}
                              render={({ field }) => (
                                <DatePicker
                                  label="Delivery Date"
                                  {...field}
                                  shouldDisableDate={shouldDisableDate}
                                  onChange={(date) => {
                                    field.onChange(date);
                                    if (date) {
                                      trigger("deliveryTime");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      size="small"
                                      error={!!errors.deliveryDate}
                                      helperText={
                                        errors.deliveryDate?.message ||
                                        (errors.deliveryTime?.message &&
                                        errors.deliveryDate?.type === "validate"
                                          ? errors.deliveryTime?.message
                                          : null)
                                      }
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
                              rules={{
                                required: "Delivery time is required",
                                validate: deliveryDateTimeValidator,
                              }}
                              render={({ field }) => (
                                <TimePicker
                                  label="Delivery Time"
                                  {...field}
                                  shouldDisableTime={shouldDisableTime}
                                  onChange={(time) => {
                                    field.onChange(time);
                                    if (time) {
                                      trigger("deliveryDate");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      size="small"
                                      error={!!errors.deliveryTime}
                                      helperText={
                                        errors.deliveryTime?.message ||
                                        (errors.deliveryDate?.message &&
                                        errors.deliveryTime?.type === "validate"
                                          ? errors.deliveryDate?.message
                                          : null)
                                      }
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
                        <EnhancedAddressManager
                          user={user}
                          onAddressSelect={setAddress}
                        />
                        {address && (
                          <Box mt={2}>
                            <Typography variant="subtitle1">
                              Selected Address:
                            </Typography>
                            <Typography>
                              {address.addressLine1}, {address.addressLine2}
                            </Typography>
                            <Typography>
                              {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </Typography>
                            <Typography>{address.country}</Typography>
                          </Box>
                        )}
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
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle1">Total:</Typography>
                        <Typography variant="subtitle1">
                          ${cartTotal}
                        </Typography>
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
          </FormProvider>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default Checkout;
