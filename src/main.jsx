import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./hooks/AuthProvider";
import { Box } from "@mui/material";
import Layout from "./pages/Layout";
import Checkout from "./pages/Checkout";
import HomePage from "./pages/HomePage";
import ProductView from "./pages/ProductView";
import { CartProvider } from "./hooks/CartProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserAccount from "./pages/UserAccount";
import ViewOrder from "./pages/ViewOrder";
import OrdersPage from "./pages/OrdersPage";
import ProductsManager from "./pages/ProductsManager";

// Create a client
const queryClient = new QueryClient();

// Admin Routes
const adminRoutes = [
  {
    path: "*",
    element: <Box>Admin</Box>,
  },

  {
    path: "products",
    children: [
      {
        path: "*",
        element: <>Page Not Found</>,
      },
    ],
  },
];

// Router Setup
const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },

      {
        path: "login",
        element: <Login />,
      },

      {
        path: "register",
        element: <Register />,
      },

      {
        path: "profile",
        element: <UserAccount />,
      },

      {
        path: "product/:id",
        index: true,
        element: <ProductView />,
      },
      {
        path: "checkout",
        index: true,
        element: <Checkout />,
      },
      {
        path: "order/:orderId",
        index: true,
        element: <ViewOrder />,
      },
      {
        path: "orders",
        index: true,
        element: <OrdersPage />,
      },
      {
        path: "products",
        index: true,
        element: <ProductsManager />,
      },
    ],
  },

  {
    path: "admin",
    element: <>Admin</>,
    children: adminRoutes,
  },
  {
    path: "*",
    element: <>Page Not Found</>,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* Move CartProvider higher */}
        <AuthProvider>
          <Suspense fallback={<>Loading</>}>
            <RouterProvider router={router} />
          </Suspense>
        </AuthProvider>
      </CartProvider>
    </QueryClientProvider>
  </StrictMode>
);
