import { useEffect, useState } from "react";
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
  Avatar,
  Tooltip,
} from "@mui/material";
import { FiLogIn, FiShoppingBag, FiUser } from "react-icons/fi";
import CartDrawer from "./CartDrawer";
import { Outlet, useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

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
  const { user, getUser, logout } = useAuth();
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

  const handleLogoutClick = () => {
    logout();
    handleClose();
  };

  return (
    <Box>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6" // Use variant for semantic meaning
            component={Link} // Make it a link
            to="/" // Link to the home page
            sx={{
              fontWeight: 700,
              fontSize: 20,
              textDecoration: "none", // Remove underline from the link
              color: "inherit", // Inherit the color from the theme
            }}
          >
            Trolley
          </Typography>
          <Box sx={{ flexGrow: 1, ml: 2 }}></Box>
          <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
            {user?.email && (
              <>
                <MenuItem onClick={() => navigate("orders")}>
                  My Orders{" "}
                </MenuItem>
                <MenuItem onClick={() => navigate("products")}>
                  Products Management{" "}
                </MenuItem>
              </>
            )}

            <Tooltip title={user?.email ? "Open User Menu" : "Login"}>
              <IconButton
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                aria-label={user?.email ? "Open user menu" : "Log in"} // Accessibility
              >
                {user?.email ? (
                  <Avatar
                    alt={`User: ${user?.email}`}
                    src={user?.imageUrl}
                    sx={{
                      width: 25,
                      height: 25,
                      border: 1,
                      borderColor: "divider",
                    }}
                  />
                ) : (
                  <FiLogIn />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {!user?.email ? (
                <MenuItem onClick={handleLoginClick}>Login</MenuItem>
              ) : (
                <>
                  <MenuItem disabled>
                    <Typography variant="body2">{user?.email}</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                  <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
                  <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                </>
              )}
            </Menu>
            <Tooltip title="Open Shopping Cart">
              <IconButton
                onClick={() => setCartOpen(true)}
                aria-label="Open shopping cart" // Accessibility
              >
                <StyledBadge
                  badgeContent={cartCount}
                  aria-label={`${cartCount} items in cart`}
                >
                  {/* Accessibility */}
                  <FiShoppingBag />
                </StyledBadge>
              </IconButton>
            </Tooltip>
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
