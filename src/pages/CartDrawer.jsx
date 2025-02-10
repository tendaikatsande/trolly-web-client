import { Box, Typography, Button, IconButton, Drawer } from "@mui/material";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import { FcEmptyFilter } from "react-icons/fc";
import { PiEmpty } from "react-icons/pi";
import { GiEmptyHourglass } from "react-icons/gi";

// Cart Drawer Component
const CartDrawer = ({ open, onClose }) => {
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    reduceQuantity,
  } = useCart();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 400 },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">{cartCount} items</Typography>
          <IconButton onClick={onClose}>
            <FiX />
          </IconButton>
        </Box>
        {cart.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              p: 1,
              borderRadius: 1,
              bgcolor: "grey.50",
            }}
          >
            <Box
              component="img"
              src="https://placehold.co/80x80"
              sx={{ width: 80, height: 80, mr: 2, borderRadius: 1 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.price.toFixed(2)} x {item.quantity}
              </Typography>
            </Box>

            <Box>
              <IconButton onClick={() => reduceQuantity(item.id)}>
                <FiMinus />
              </IconButton>
              <IconButton onClick={() => increaseQuantity(item.id)}>
                <FiPlus />
              </IconButton>
            </Box>
            <IconButton size="small" onClick={() => removeFromCart(item.id)}>
              <FiX />
            </IconButton>
          </Box>
        ))}
        {cartCount > 0 && (
          <Box sx={{ mt: "auto" }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mb: 1 }}
              href="checkout"
            >
              Checkout Now (${cartTotal.toFixed(2)})
            </Button>
            <Button fullWidth variant="outlined">
              View Cart
            </Button>
          </Box>
        )}

        {cartCount == 0 && (
          <Box
            sx={{
              mt: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography>Your Cart is empty</Typography>
            <Button variant="outlined" fullWidth href="/">
              Add items to cart
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
