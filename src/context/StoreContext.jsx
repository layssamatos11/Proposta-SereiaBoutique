import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "../data/products";
import { store } from "../data/store";
import { quote } from "../lib/money";

const KEY = "sereia-boutique";
const StoreContext = createContext(null);

function load() {
  const empty = { cart: [], favorites: [], coupon: "", club: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const data = JSON.parse(raw);
    return {
      cart: Array.isArray(data.cart) ? data.cart : [],
      favorites: Array.isArray(data.favorites) ? data.favorites : [],
      coupon: typeof data.coupon === "string" ? data.coupon : "",
      club: Boolean(data.club),
    };
  } catch {
    return empty;
  }
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(load);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const lines = useMemo(
    () =>
      state.cart
        .map((line) => {
          const product = getProduct(line.id);
          if (!product) return null;
          return { ...line, product, price: product.price, name: product.name };
        })
        .filter(Boolean),
    [state.cart],
  );

  const summary = useMemo(
    () => quote(lines, { couponApplied: state.coupon === store.couponCode }),
    [lines, state.coupon],
  );

  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  function usedQty(id, cart = state.cart) {
    return cart.filter((line) => line.id === id).reduce((sum, line) => sum + line.qty, 0);
  }

  function addToCart(id, color, size, qty = 1) {
    const product = getProduct(id);
    if (!product) return { ok: false, message: "Peça indisponível." };
    let added = 0;
    setState((current) => {
      const room = product.stock - usedQty(id, current.cart);
      const nextQty = Math.min(qty, room);
      if (nextQty <= 0) return current;
      added = nextQty;
      const cart = current.cart.map((line) => ({ ...line }));
      const index = cart.findIndex((line) => line.id === id && line.color === color && line.size === size);
      if (index >= 0) cart[index].qty += nextQty;
      else cart.push({ id, color, size, qty: nextQty });
      return { ...current, cart };
    });
    if (added <= 0) return { ok: false, message: "Essa peça esgotou o estoque." };
    setCartOpen(true);
    return { ok: true };
  }

  function updateQty(id, color, size, qty) {
    setState((current) => {
      const product = getProduct(id);
      const others = current.cart
        .filter((line) => line.id === id && !(line.color === color && line.size === size))
        .reduce((sum, line) => sum + line.qty, 0);
      const max = Math.max(0, (product?.stock ?? 0) - others);
      const next = Math.min(Math.max(1, qty), max || 1);
      return {
        ...current,
        cart: current.cart.map((line) =>
          line.id === id && line.color === color && line.size === size ? { ...line, qty: next } : line,
        ),
      };
    });
  }

  function updateOption(id, color, size, patch) {
    setState((current) => {
      const cart = current.cart.map((line) => ({ ...line }));
      const index = cart.findIndex((line) => line.id === id && line.color === color && line.size === size);
      if (index < 0) return current;
      const next = { ...cart[index], ...patch };
      cart.splice(index, 1);
      const existing = cart.findIndex((line) => line.id === next.id && line.color === next.color && line.size === next.size);
      if (existing >= 0) cart[existing].qty += next.qty;
      else cart.push(next);
      const product = getProduct(next.id);
      const total = cart.filter((line) => line.id === next.id).reduce((sum, line) => sum + line.qty, 0);
      if (product && total > product.stock) {
        const overflow = total - product.stock;
        const target = cart.find((line) => line.id === next.id && line.color === next.color && line.size === next.size);
        target.qty = Math.max(1, target.qty - overflow);
      }
      return { ...current, cart };
    });
  }

  function removeLine(id, color, size) {
    setState((current) => ({
      ...current,
      cart: current.cart.filter((line) => !(line.id === id && line.color === color && line.size === size)),
    }));
  }

  function clearCart() {
    setState((current) => {
      const next = { ...current, cart: [] };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggleFavorite(id) {
    setState((current) => ({
      ...current,
      favorites: current.favorites.includes(id)
        ? current.favorites.filter((item) => item !== id)
        : [...current.favorites, id],
    }));
  }

  function applyCoupon(code) {
    const normalized = code.trim().toUpperCase();
    if (normalized !== store.couponCode) return false;
    setState((current) => ({ ...current, coupon: store.couponCode }));
    return true;
  }

  function removeCoupon() {
    setState((current) => ({ ...current, coupon: "" }));
  }

  function joinClub() {
    setState((current) => ({ ...current, club: true, coupon: store.couponCode }));
  }

  const value = {
    ...state,
    lines,
    summary,
    count,
    cartOpen,
    setCartOpen,
    addToCart,
    updateQty,
    updateOption,
    removeLine,
    clearCart,
    toggleFavorite,
    applyCoupon,
    removeCoupon,
    joinClub,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore precisa estar dentro do StoreProvider");
  return context;
}
