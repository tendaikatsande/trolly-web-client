import { useState } from "react";
import { cancelOrder, getOrders } from "../services/OrderService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Notification state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch orders
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSnackbarMessage("Order cancelled successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    },
    onError: (error) => {
      setSnackbarMessage(`Error cancelling order: ${error.message}`);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const handleCancelOrder = (orderId) => {
    cancelOrderMutation.mutate(orderId);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const parseDate = (d) => {
    return new Date(d[0], d[1] - 1, d[2], d[3], d[4], d[5]);
  };

  return (
    <Container sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      {/* Loading & Error Handling */}
      {isLoading && (
        <Box display="flex" flexDirection="column" gap={2}>
          {[1, 2, 3].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width="100%"
              height={70}
            />
          ))}
        </Box>
      )}
      {error && (
        <Typography color="error">
          Error loading orders: {error.message}
        </Typography>
      )}

      {/* Orders List & Details */}
      {!isLoading && !error && orders && (
        <List>
          {orders.data?.length === 0 ? (
            <Typography>No orders found.</Typography>
          ) : (
            orders.data.content.map((order, index) => (
              <Box key={order.id}>
                <ListItem
                  sx={{
                    padding: "12px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        Order #{order.id}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Total Amount: ${order.totalAmount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on:
                          {dayjs(order.createdAt).format(
                            "MMMM DD, YYYY hh:mm A"
                          )}
                        </Typography>
                      </>
                    }
                  />
                  <Box mt={1} display="flex" gap={1}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details
                    </Button>
                    {order.status.toLowerCase() !== "cancelled" && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelOrderMutation.isLoading}
                      >
                        {cancelOrderMutation.isLoading ? (
                          <CircularProgress size={16} />
                        ) : (
                          "Cancel Order"
                        )}
                      </Button>
                    )}
                  </Box>
                </ListItem>
                {index !== orders.data.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      )}

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrdersPage;
