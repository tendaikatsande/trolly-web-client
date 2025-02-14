import { createContext, useMemo, useState, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  //empty cart
  const emptyCart = () => {
    setCart([]);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const increaseQuantity = (productId, step = 1) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + step }
          : item
      )
    );
  };

  const reduceQuantity = (productId, step = 1) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(item.quantity - step, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getProductQuantity = useMemo(
    () => (productId) => {
      if (!productId) return 0; // Or handle the error appropriately
      const item = cart.find((item) => item.id === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  const cartState = useMemo(
    () => ({
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      increaseQuantity,
      reduceQuantity,
      getProductQuantity,
      emptyCart,
    }),
    [cart, cartCount, cartTotal, getProductQuantity]
  );

  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
};

export { CartContext, CartProvider };
