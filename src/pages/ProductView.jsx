import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "../services/ProductService";
import { useCart } from "../hooks/useCart";

const ProductView = () => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, increaseQuantity, reduceQuantity, getProductQuantity } =
    useCart();
  const params = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", params.id],
    queryFn: () => getProduct(params.id),
  });

  // Extract product data once
  const product = data?.data;

  useEffect(() => {
    if (product) {
      setQuantity(getProductQuantity(product.id)); // Sync quantity with cart state on product load
    }
  }, [product, getProductQuantity]);

  // Handle quantity increase
  const handleIncreaseQuantity = () => {
    if (quantity == 0) {
      handleAddToCart();
    } else {
      increaseQuantity(product.id);
      setQuantity(getProductQuantity(product.id));
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = () => {
    reduceQuantity(product.id);
    setQuantity(getProductQuantity(product.id));
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product);
    setQuantity(getProductQuantity(product.id));
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading product data.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              component="img"
              src={product?.imageUrl}
              alt={product?.name}
              sx={{ width: "100%", borderRadius: 2 }}
            />
            <Grid container spacing={2}>
              {[product?.imageUrl].map((image, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    component="img"
                    src={image}
                    alt={`${product?.name} ${index + 1}`}
                    sx={{ width: "100%", borderRadius: 2 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {product?.name}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            ${product?.price?.toFixed(2)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {product?.description}
          </Typography>

          {/* Quantity Selector */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <IconButton
              onClick={handleDecreaseQuantity}
              disabled={quantity <= 1}
            >
              <FiMinus />
            </IconButton>
            <TextField
              value={quantity}
              size="small"
              sx={{ width: 60, mx: 1 }}
              slotProps={{
                htmlInput: { style: { textAlign: "center" } },
              }}
              disabled
            />
            <IconButton onClick={handleIncreaseQuantity}>
              <FiPlus />
            </IconButton>
          </Box>

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            startIcon={<FiShoppingCart />}
            onClick={handleAddToCart}
            sx={{ mb: 4, width: "100%", py: 1.5 }}
            disabled={isLoading || !product}
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductView;
