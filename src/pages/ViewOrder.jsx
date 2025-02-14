import { useParams } from "react-router";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../services/OrderService";
import dayjs from "dayjs";

const ViewOrder = () => {
  const { orderId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
  });

  const order = data?.data;

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
              <Typography>
                Payment Method: {order?.paymentMethod || "Not specified"}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewOrder;
