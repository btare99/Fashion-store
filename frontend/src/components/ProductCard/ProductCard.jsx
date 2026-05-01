import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imgIdx, setImgIdx] = useState(0);
  
  const liked = isInWishlist(product._id);

  const img = product.images?.[imgIdx] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80';
  const hoverImg = product.images?.[1];

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <article className="product-card">
      {/* Image */}
      <div className="product-card__img-wrap">
        <Link to={`/products/${product._id}`}>
          <img
            src={img}
            alt={product.name}
            className="product-card__img product-card__img--main"
            loading="lazy"
          />
          {hoverImg && (
            <img
              src={hoverImg}
              alt={product.name}
              className="product-card__img product-card__img--hover"
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="product-card__badges">
          {product.isNewUser && <span className="tag tag-green">New</span>}
          {product.isSale && discount && <span className="tag tag-red">-{discount}%</span>}
        </div>

        {/* Actions overlay */}
        <div className="product-card__actions">
          <button
            className={`product-card__action-btn ${liked ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            aria-label="Wishlist"
          >
            <FiHeart size={16} fill={liked ? 'var(--gold)' : 'none'} color={liked ? 'var(--gold)' : 'currentColor'} />
          </button>
          <Link to={`/products/${product._id}`} className="product-card__action-btn" aria-label="Shiko">
            <FiEye size={16} />
          </Link>
          <button
            className="product-card__action-btn"
            onClick={() => addItem(product, 1, product.sizes?.[0] || '', product.colors?.[0]?.name || '')}
            aria-label="Shto në shportë"
          >
            <FiShoppingBag size={16} />
          </button>
        </div>

        {/* Quick add sizes */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-card__quick-sizes">
            {product.sizes.slice(0, 6).map(size => (
              <button
                key={size}
                className="product-card__size-btn"
                onClick={() => addItem(product, 1, size, product.colors?.[0]?.name || '')}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="product-card__info">
        <div className="product-card__meta">
          <span className="product-card__category">{product.category}</span>
          {product.rating > 0 && (
            <span className="product-card__rating">
              <FiStar size={11} fill="currentColor" /> {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <Link to={`/products/${product._id}`} className="product-card__name">{product.name}</Link>
        {product.brand && <p className="product-card__brand">{product.brand}</p>}
        <div className="product-card__price-row">
          <span className="product-card__price">{product.price.toFixed(2)} €</span>
          {product.originalPrice && (
            <span className="product-card__original">{product.originalPrice.toFixed(2)} €</span>
          )}
        </div>
        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="product-card__colors">
            {product.colors.slice(0, 5).map((c, i) => (
              <span
                key={i}
                className="product-card__color-dot"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
