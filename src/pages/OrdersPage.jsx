import { useState, useCallback, useEffect } from "react";
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

  const [page, setPage] = useState(0);
  const [pageSize] = useState(3);
  const [allOrders, setAllOrders] = useState([]); // To accumulate orders

  // Notification state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    error,
    isFetchingNextPage,
  } = useQuery({
    queryKey: ["orders", page, pageSize],
    queryFn: () => getOrders({ page, size: pageSize }),
    keepPreviousData: true, // keep the data from the previous page while fetching the next one
  });

  const handleLoadMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1); // Increment page number
  }, []);

  // Update allOrders when new data is available
  useEffect(() => {
    if (ordersData?.data?.content) {
      setAllOrders((prevOrders) => {
        const newOrders = ordersData.data.content.filter(
          (order) => !prevOrders.find((prevOrder) => prevOrder.id === order.id)
        );
        return [...prevOrders, ...newOrders];
      });
    }
  }, [ordersData?.data?.content]);

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
        return "info";
      case "confirmed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Container sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      {ordersData?.data?.totalElements !== undefined && (
        <Typography variant="subtitle1" gutterBottom>
          Total Orders: {ordersData.data.totalElements}
        </Typography>
      )}
      {/* Loading & Error Handling */}
      {isLoading && page === 0 && (
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
      {!isLoading && !error && (
        <List>
          {allOrders.length === 0 && !isLoading ? (
            <Typography>No orders found.</Typography>
          ) : (
            allOrders.map((order, index) => (
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
                    {![
                      "WAITING_FOR_PAYMENT",
                      "CREATED",
                      "CONFIRMED",
                      "DELIVERED",
                      "CANCELLED",
                    ].includes(order.status) && (
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
                {index !== allOrders.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      )}

      {/* Conditionally render the Load More button */}
      {ordersData?.data?.last === false && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            startIcon={
              isFetchingNextPage ? <CircularProgress size={16} /> : null
            }
          >
            Load More
          </Button>
        </Box>
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
