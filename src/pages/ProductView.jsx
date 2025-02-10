import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { useParams } from "react-router";

const ProductView = () => {
  const [quantity, setQuantity] = useState(1);
  const params = useParams();

  // Dummy product data - replace with actual data from your backend
  const product = {
    name: "Silver High Neck Sweater",
    price: 250.0,
    description:
      "A stylish and comfortable high-neck sweater, perfect for the winter season. Made from premium quality materials for a soft and cozy feel.",
    images: [
      "https://placehold.co/200x200",
      "https://placehold.co/200x200",
      "https://placehold.co/200x200",
    ],
  };

  // Handle quantity increase
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
    // Add your cart logic here
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              component="img"
              src={product.images[0]}
              alt={product.name}
              sx={{ width: "100%", borderRadius: 2 }}
            />
            <Grid container spacing={2}>
              {product.images.slice(1).map((image, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    component="img"
                    src={image}
                    alt={`${product.name} ${index + 1}`}
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
            {product.name}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {product.description}
          </Typography>

          {/* Quantity Selector */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <IconButton onClick={handleDecreaseQuantity}>
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
          >
            Add to Cart
          </Button>

          {/* Additional Information */}
          <Paper elevation={0} sx={{ p: 2, border: "1px solid #e0e0e0" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Product Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Material" secondary="Premium Wool" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Color" secondary="Silver" />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Size" secondary="Medium" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductView;
