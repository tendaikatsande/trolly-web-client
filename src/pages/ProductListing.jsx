import {
  Box,
  Grid2,
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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/ProductService";

const ProductListing = ({ searchQuery, selectedCategory, sortOrder }) => {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  console.log(products);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const filteredProducts = products.content
    .filter(
      (product) =>
        selectedCategory === "All Categories" ||
        product.category === selectedCategory
    )
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <Grid2 container spacing={9}>
      {filteredProducts.map((product) => (
        <Grid2 item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <Card
            sx={{
              border: "1px solid #ddd",
              borderRadius: 0,
              boxShadow: "none",
              minWidth: "320px",
            }}
          >
            <CardMedia
              component="img"
              height="160"
              image={product.image}
              alt={product.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h6" fontWeight={600}>
                {product.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating
                  value={product.rating}
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
                ${product.price.toFixed(2)}
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
                  handleOpen();
                }}
              >
                Add to Cart
              </Button>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  onClose={handleClose}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Item Added to Cart
                </Alert>
              </Snackbar>
            </CardActions>
          </Card>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductListing;
