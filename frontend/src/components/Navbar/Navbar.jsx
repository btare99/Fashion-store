import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiHeart, FiTruck, FiGift, FiZap } from 'react-icons/fi';
import './Navbar.css';

const CATEGORIES = ['Këpucë', 'Rroba Burra', 'Rroba Gra', 'Aksesorë', 'Çanta', 'Sporte', 'Fëmijë'];

export default function Navbar() {
  const { count } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-text">LUXE</span>
            <span className="navbar__logo-sub">STORE</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar__links">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="navbar__link"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar__actions">
            <button
              className="navbar__icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Kërko"
            >
              <FiSearch size={20} />
            </button>
            <Link to="/wishlist" className="navbar__cart-btn" aria-label="Wishlist">
              <FiHeart size={20} />
              {wishlist.length > 0 && <span className="navbar__cart-badge">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="navbar__cart-btn">
              <FiShoppingBag size={20} />
              {count > 0 && <span className="navbar__cart-badge">{count}</span>}
            </Link>
            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="navbar__announcement">
          <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
            <FiTruck/> Transport falas për porosi mbi 50€ &nbsp;·&nbsp; 
            <FiGift/> Koleksioni i ri i verës tani disponibël &nbsp;·&nbsp; 
            <FiZap/> Deri -40% në sale
          </span>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__content">
          <ul className="mobile-menu__links">
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="mobile-menu__link"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__footer">
            <Link to="/cart" className="btn btn-primary" style={{width:'100%'}} onClick={() => setMenuOpen(false)}>
              <FiShoppingBag /> Shporta ({count})
            </Link>
          </div>
        </div>
      </div>
      {menuOpen && <div className="mobile-menu__overlay" onClick={() => setMenuOpen(false)} />}

      {/* Search Modal */}
      {searchOpen && (
        <div className="search-modal" onClick={() => setSearchOpen(false)}>
          <div className="search-modal__inner" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="search-modal__form">
              <FiSearch size={22} className="search-modal__icon" />
              <input
                autoFocus
                type="text"
                placeholder="Kërko produkte..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-modal__input"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="search-modal__close">
                <FiX size={22} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
