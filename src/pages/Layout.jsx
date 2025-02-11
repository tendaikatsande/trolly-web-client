import { useState } from "react";
import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Badge,
  styled,
  Container,
  Typography,
} from "@mui/material";
import { FiShoppingBag, FiUser } from "react-icons/fi";
import CartDrawer from "./CartDrawer";
import { Outlet } from "react-router";
import { useCart } from "../hooks/useCart";
import { useQuery } from "@tanstack/react-query";

// Styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#fff",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));

// Main Layout Component
const Layout = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <Box>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography href="/" sx={{ fontWeight: 700, fontSize: 20 }}>
            Trolley
          </Typography>
          <Box sx={{ flexGrow: 1, ml: 2 }}></Box>
          <Box sx={{ ml: 2 }}>
            <IconButton>
              <FiUser />
            </IconButton>
            <IconButton onClick={() => setCartOpen(true)}>
              <StyledBadge badgeContent={cartCount}>
                <FiShoppingBag />
              </StyledBadge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
