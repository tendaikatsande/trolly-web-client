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
  Menu,
  MenuItem,
} from "@mui/material";
import { FiShoppingBag, FiUser } from "react-icons/fi";
import CartDrawer from "./CartDrawer";
import { Outlet, useNavigate } from "react-router";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

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
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the menu
  const open = Boolean(anchorEl); // Boolean to control menu open state
  const navigate = useNavigate(); // Initialize navigate
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    navigate("/profile"); // Navigate to the profile route
  };

  const handleLoginClick = () => {
    handleClose();
    navigate("/login"); // Navigate to the login route
  };

  const handleSettingsClick = () => {
    handleClose();
    navigate("/settings"); // Navigate to the settings route
  };

  return (
    <Box>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography href="/" sx={{ fontWeight: 700, fontSize: 20 }}>
            Trolley
          </Typography>
          <Box sx={{ flexGrow: 1, ml: 2 }}></Box>
          <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
            <IconButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <FiUser />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleLoginClick}>Login</MenuItem>
              {user?.email && (
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              )}

              <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
            </Menu>
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
