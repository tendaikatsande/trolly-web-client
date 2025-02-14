import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  CircularProgress,
  TableContainer,
  TablePagination,
} from "@mui/material";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/ProductService";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

const ProductsManager = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);

  // Fetch products from the API
  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", page, pageSize],
    queryFn: () => getProducts(null, null, { page, size: pageSize, sort: [] }),
    keepPreviousData: true,
  });

  const products = productsData?.data.content || [];
  const totalElements = productsData?.data.totalElements || 0;

  // Mutation to create a new product using multipart/form-data
  const createMutation = useMutation({
    mutationFn: (formData) => addProduct(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  // Mutation to update an existing product using multipart/form-data
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  // Mutation to delete (delist) a product
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  // Form submission handler for both create and update
  const onSubmit = (data) => {
    const formData = new FormData();

    // Build a product object with the necessary fields
    const product = {
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
    };

    // Append the product JSON as a Blob under the key "product"
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    // Append the file if one is selected
    if (data.file && data.file[0]) {
      formData.append("file", data.file[0]);
    }

    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, formData });
    } else {
      createMutation.mutate(formData);
    }
    handleCloseDialog();
  };

  // Prepopulate form for editing a product
  const handleEdit = (product) => {
    setEditProduct(product);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("quantity", product.quantity);
    // File input is not pre-populated for security reasons.
    setDialogOpen(true);
  };

  // Delete a product
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // Open the dialog to create a new product
  const handleOpenDialog = () => {
    setEditProduct(null);
    reset();
    setDialogOpen(true);
  };

  // Close the dialog and reset form
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditProduct(null);
    reset();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when page size changes
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Products Manager
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        sx={{ mb: 2 }}
      >
        Create Product
      </Button>

      {/* Render loading state */}
      {isLoading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {/* Render error state */}
      {isError && (
        <Typography color="error">Error loading products.</Typography>
      )}

      {/* Render products table */}
      {!isLoading && !isError && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Image</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ height: 50 }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      onClick={() => handleEdit(product)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[3, 5, 10]}
          />
        </TableContainer>
      )}

      {/* Dialog for creating/updating a product */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editProduct ? "Update Product" : "Create Product"}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <DialogContent>
            <TextField
              {...register("name", { required: "Name is required" })}
              label="Name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register("description", {
                required: "Description is required",
              })}
              label="Description"
              fullWidth
              margin="normal"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
              })}
              label="Quantity"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              {watch("file") && watch("file").length > 0
                ? watch("file")[0].name
                : "Select Image"}
              <input
                type="file"
                {...register("file")}
                accept="image/*"
                hidden
              />
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editProduct ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProductsManager;
