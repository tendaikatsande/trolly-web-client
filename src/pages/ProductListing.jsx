import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Rating,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { FiEye, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/ProductService";

const ProductListing = ({ searchQuery, selectedCategory, sortOrder }) => {
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Reset products and page when filters change
  useEffect(() => {
    setPage(0);
    setProducts([]);
  }, [searchQuery, selectedCategory, sortOrder]);

  const { data, isFetching } = useQuery({
    queryKey: ["products", page, searchQuery, selectedCategory, sortOrder],
    queryFn: () =>
      getProducts(searchQuery, selectedCategory, {
        page,
        size: 10,
        sort: [],
      }),

    keepPreviousData: true,
  });

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid container spacing={3}>
        {data?.data?.content.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: 2,
                minWidth: "280px",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={product.imageUrl || "https://placehold.co/200x200"}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Rating
                    value={product?.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({product.rating})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${product.price?.toFixed(2) || "N/A"}
                </Typography>
              </CardContent>
              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <IconButton onClick={() => navigate(`/product/${product.id}`)}>
                  <FiEye />
                </IconButton>

                <Button
                  variant="outlined"
                  startIcon={<FiShoppingCart />}
                  onClick={() => {
                    addToCart(product);
                    setSnackbarOpen(true);
                  }}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Details */}
      {data?.data?.empty && (
        <Box mt={3}>
          <Typography variant="body2" color="textSecondary">
            Page {data.data?.number + 1 || 0} of {data.data?.totalPages || 0} |
            Total Products: {data.data?.totalElements || 0}
          </Typography>
        </Box>
      )}

      {/* Load More Button */}
      <Box textAlign="center" mt={3}>
        {data?.data?.last && (
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            disabled={isFetching || data.data?.last}
          >
            {isFetching ? "Loading..." : "Load More"}
          </Button>
        )}
        {data?.empty && (
          <Typography variant="body1" color="textSecondary">
            No products found
          </Typography>
        )}
      </Box>

      {/* Snackbar for cart notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Item Added to Cart
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductListing;
