import { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Typography,
  Grid, // Added Grid for better layout
  Card, // Added Card for visual grouping
  useMediaQuery, // Added useMediaQuery for responsiveness
  Tooltip, // Added Tooltip for clarity
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import ProductListing from "./ProductListing";
import { useTheme } from "@mui/material/styles"; // Added useTheme for theme awareness

const HomePage = () => {
  const categories = [
    "All Categories",
    "Grocery",
    "Beauty & Makeup",
    "Electronics",
    "Furniture",
    "Fashion",
    "Bakery",
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [sortOrder, setSortOrder] = useState("asc");

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Example breakpoint

  return (
    <Box>
      {/* Hero Section */}
      <Card
        sx={{
          p: 4,
          bgcolor: "primary.light",
          color: "white",
          textAlign: "center",
          mb: 3,
          borderRadius: 2, // Slightly larger border radius
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Our Amazing Store!
        </Typography>
        <Typography variant="subtitle1">
          Find everything you need right here. Start exploring!
        </Typography>

        {/* Search and Filter Bar */}
        <Grid
          container
          spacing={2}
          mt={3}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth // Take full width of the grid item
              size="small"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                ),
                style: { backgroundColor: "white" }, // Explicitly set background
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category" // Make sure label matches labelId
                sx={{ bgcolor: "white" }} // Keep background white
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Product Listing Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Distribute space
          mb: 1, // Reduced margin
          mt: 2,
          p: 1,
          bgcolor: "background.paper", // Use theme background
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Product Listing</Typography>
        <Tooltip
          title={`Sort Alphabetically (${sortOrder === "asc" ? "A-Z" : "Z-A"})`}
        >
          <IconButton
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            aria-label="toggle sort order" // Accessibility
          >
            {sortOrder === "asc" ? <BiSortDown /> : <BiSortUp />}
          </IconButton>
        </Tooltip>
      </Box>

      <ProductListing
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        sortOrder={sortOrder}
      />
    </Box>
  );
};

export default HomePage;
