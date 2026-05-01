import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import './WishlistPage.css';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <main className="wishlist-page page-enter">
      <div className="container">
        <div className="wishlist-page__header">
          <h1 className="wishlist-page__title">Të Preferuarat ({wishlist.length})</h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FiHeart size={48} color="var(--border)" />
            </div>
            <h3>Nuk keni produkte të pëlqyera</h3>
            <p>Zbuloni produktet tona dhe shtoni ato që ju pëlqejnë.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
              Shiko Produktet <FiArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {wishlist.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
