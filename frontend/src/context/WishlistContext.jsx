import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('luxe_wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isLiked = prev.some(item => item._id === product._id);
      let newWishlist;
      if (isLiked) {
        newWishlist = prev.filter(item => item._id !== product._id);
        toast.success('U hoq nga të preferuarat');
      } else {
        newWishlist = [...prev, product];
        toast.success('U shtua tek të preferuarat');
      }
      localStorage.setItem('luxe_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
