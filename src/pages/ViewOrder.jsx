import { Link, useNavigate, useParams } from "react-router";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Divider,
  Chip,
  Button,
  Select,
  MenuItem,
  Input,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPayment,
  getOrder,
  updatePayment,
} from "../services/OrderService";
import dayjs from "dayjs";
import {
  checkPayment,
  initiateMobilePayment,
  initiateWebPayment,
  pollPayment,
} from "../services/PaymentService";
import { useState } from "react";

const ViewOrder = () => {
  const { orderId } = useParams();
  const [refetch, setRefetch] = useState();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId, refetch],
    queryFn: () => getOrder(orderId),
  });

  const order = data?.data;

  const initiateWebPaymentMutation = useMutation({
    mutationFn: (payload) => initiateWebPayment(payload),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      createPaymentMutation.mutate(data);
      setRefetch(true);
    },
  });
  const createPaymentMutation = useMutation({
    mutationFn: (payload) => createPayment(order.id, payload),
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      console.log(data.redirectUrl);
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setRefetch(true);
      }
    },
  });
  const initiateMobilePaymentMutation = useMutation({
    mutationFn: (payload) => initiateMobilePayment(payload),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      createPaymentMutation.mutate(data);
      setRefetch(true);
    },
  });

  const checkPaymentStatusMutation = useMutation({
    mutationFn: (payload) => checkPayment(payload),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      console.log(data);
      updateOrderPaymentMutation.mutate(data);
      setRefetch(true);
    },
  });

  const checkisPaidMutation = useMutation({
    mutationFn: (payload) => pollPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setRefetch(true);
    },
  });

  const updateOrderPaymentMutation = useMutation({
    mutationFn: (payload) => updatePayment(order.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setRefetch(true);
    },
  });

  // updatePayment;

  const handleInitiateWebPayment = () => {
    const payload = {
      orderId: order.id,
      phoneNumber: null,
      mobileMoneyMethod: null,
      orderItems: order.items,
    };
    initiateWebPaymentMutation.mutate(payload);
  };
  const handleInitiateMobilePayment = () => {
    const payload = {
      orderId: order.id,
      phoneNumber: "0771111111",
      mobileMoneyMethod: "ECOCASH",
      orderItems: order.items,
    };
    initiateMobilePaymentMutation.mutate(payload);
  };
  const handleInitiateCheckPayment = () => {
    checkPaymentStatusMutation.mutate({ url: order.pollUrl });
  };
  const handleChechIsPaidPayment = () => {
    checkisPaidMutation.mutate({ url: order.pollUrl });
  };

  // ✅ Handle loading and error states
  if (isLoading) return <Typography>Loading order details...</Typography>;
  if (error)
    return <Typography>Error loading order: {error.message}</Typography>;
  if (!order) return <Typography>No order found.</Typography>; // Handle missing data

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6">Order Information</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Order ID: {order.id}</Typography>
              <Typography>
                Date: {dayjs(order.createdAt).format("MMMM DD, YYYY hh:mm A")}
              </Typography>
              <Typography>
                Status: <Chip label={order.status} color="primary" />
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6">Shipping Address</Typography>
            {order?.shippingAddress &&
            Object.values(order.shippingAddress).some((val) => val) ? (
              <Box sx={{ mt: 2 }}>
                <Typography>
                  {order.shippingAddress.fullName || "N/A"}
                </Typography>
                <Typography>
                  {order.shippingAddress.addressLine1 || "N/A"}
                </Typography>
                {order.shippingAddress.addressLine2 && (
                  <Typography>{order.shippingAddress.addressLine2}</Typography>
                )}
                <Typography>
                  {order.shippingAddress.city || "N/A"},{" "}
                  {order.shippingAddress.state || "N/A"}{" "}
                  {order.shippingAddress.postalCode || "N/A"}
                </Typography>
                <Typography>
                  {order.shippingAddress.country || "N/A"}
                </Typography>
                <Typography>
                  Phone: {order.shippingAddress.phone || "N/A"}
                </Typography>
              </Box>
            ) : (
              <Typography>No shipping address available.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              {order?.items?.length > 0 ? (
                order.items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>
                      {item.quantity} x {item.productName}
                    </Typography>
                    <Typography>${Number(item.price).toFixed(2)}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No items in this order.</Typography>
              )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle1">Total:</Typography>
              <Typography variant="subtitle1">
                ${Number(order?.totalAmount || 0).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              {order.paymentMethod == "paynow" && order.status == "PENDING" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button variant="outlined" onClick={handleInitiateWebPayment}>
                    Paynow
                  </Button>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Select fullWidth value={"ECOCASH"}>
                      <MenuItem selected value="ECOCASH">
                        ECOCASH
                      </MenuItem>
                    </Select>
                    <TextField
                      margin="dense"
                      type="text"
                      fullWidth
                      value={"0771111111"}
                      disabled
                    />
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleInitiateMobilePayment}
                    >
                      Mobile Payment
                    </Button>
                  </Box>
                </Box>
              )}
              {order.paymentMethod == "paynow" &&
                order.status == "WAITING_FOR_PAYMENT" && (
                  <>
                    <Link to={order.redirectUrl}>
                      In case you you had missed payment link
                    </Link>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleInitiateCheckPayment}
                    >
                      Check Payment Status
                    </Button>
                  </>
                )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewOrder;
