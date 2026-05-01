import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1, size = '', color = '') => {
    setItems(prev => {
      const key = `${product._id}-${size}-${color}`;
      const existing = prev.find(i => `${i._id}-${i.selectedSize}-${i.selectedColor}` === key);
      if (existing) {
        toast.success('Sasia u rrit!');
        return prev.map(i =>
          `${i._id}-${i.selectedSize}-${i.selectedColor}` === key
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      toast.success('Produkti u shtua në shportë!');
      return [...prev, { ...product, quantity: qty, selectedSize: size, selectedColor: color }];
    });
  };

  const removeItem = (id, size, color) => {
    setItems(prev => prev.filter(i => !(i._id === id && i.selectedSize === size && i.selectedColor === color)));
    toast.success('Produkti u hoq nga shporta');
  };

  const updateQty = (id, size, color, qty) => {
    if (qty < 1) { removeItem(id, size, color); return; }
    setItems(prev => prev.map(i =>
      i._id === id && i.selectedSize === size && i.selectedColor === color
        ? { ...i, quantity: qty }
        : i
    ));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : subtotal === 0 ? 0 : 3;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, subtotal, shipping, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
