import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiShare2, FiChevronLeft, FiChevronRight, FiStar, FiCheck, FiTruck, FiFrown, FiAlertTriangle, FiX } from 'react-icons/fi';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [mainImg, setMainImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getById(id);
        setProduct(res.data);
        setSelectedSize(res.data.sizes?.[0] || '');
        setSelectedColor(res.data.colors?.[0]?.name || '');
        setMainImg(0);
        const rel = await productsAPI.getAll({ category: res.data.category });
        setRelated(rel.data.filter(p => p._id !== id).slice(0, 4));
      } catch { setProduct(null); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <main style={{paddingTop:120}}>
      <div className="container">
        <div className="product-detail__skeleton">
          <div className="skeleton" style={{height:560,borderRadius:16}}/>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {[80,40,120,60,200].map((h,i) => <div key={i} className="skeleton" style={{height:h,borderRadius:8}}/>)}
          </div>
        </div>
      </div>
    </main>
  );

  if (!product) return (
    <main style={{paddingTop:120}}>
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon"><FiFrown size={48} color="var(--border)" /></div>
          <h3>Produkti nuk u gjet</h3>
          <Link to="/products" className="btn btn-primary" style={{marginTop:16}}>Kthehu te produktet</Link>
        </div>
      </div>
    </main>
  );

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const imgs = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'];
  const liked = isInWishlist(product._id);

  return (
    <main className="product-detail-page page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Kryefaqja</Link>
          <span>/</span>
          <Link to="/products">Produktet</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__thumbnails">
              {imgs.map((img, i) => (
                <button key={i} className={`product-gallery__thumb ${i === mainImg ? 'active' : ''}`} onClick={() => setMainImg(i)}>
                  <img src={img} alt={`${product.name} ${i+1}`} />
                </button>
              ))}
            </div>
            <div className="product-gallery__main">
              <img src={imgs[mainImg]} alt={product.name} className="product-gallery__img" />
              {imgs.length > 1 && (
                <>
                  <button className="product-gallery__arrow product-gallery__arrow--left" onClick={() => setMainImg(i => (i - 1 + imgs.length) % imgs.length)}>
                    <FiChevronLeft size={20}/>
                  </button>
                  <button className="product-gallery__arrow product-gallery__arrow--right" onClick={() => setMainImg(i => (i + 1) % imgs.length)}>
                    <FiChevronRight size={20}/>
                  </button>
                </>
              )}
              <div className="product-gallery__badges">
                {product.isNewUser && <span className="tag tag-green">New</span>}
                {product.isSale && discount && <span className="tag tag-red">-{discount}%</span>}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="product-info">
            <div className="product-info__meta">
              <span className="product-info__category">{product.category}</span>
              {product.rating > 0 && (
                <div className="product-info__rating">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={14} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} />
                  ))}
                  <span>{product.rating.toFixed(1)} ({product.reviewCount} vlerësime)</span>
                </div>
              )}
            </div>

            <h1 className="product-info__name">{product.name}</h1>
            {product.brand && <p className="product-info__brand">by {product.brand}</p>}

            <div className="product-info__price-row">
              <span className="product-info__price">{product.price.toFixed(2)} €</span>
              {product.originalPrice && <span className="product-info__original">{product.originalPrice.toFixed(2)} €</span>}
              {discount && <span className="tag tag-red">-{discount}%</span>}
            </div>

            <p className="product-info__desc">{product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="product-option">
                <label className="product-option__label">Ngjyra: <strong>{selectedColor}</strong></label>
                <div className="product-option__colors">
                  {product.colors.map(c => (
                    <button
                      key={c.name}
                      className={`product-option__color ${selectedColor === c.name ? 'active' : ''}`}
                      style={{ background: c.hex }}
                      title={c.name}
                      onClick={() => setSelectedColor(c.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="product-option">
                <label className="product-option__label">Madhësia: <strong>{selectedSize}</strong></label>
                <div className="product-option__sizes">
                  {product.sizes.map(s => (
                    <button
                      key={s}
                      className={`product-option__size ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="product-info__actions">
              <div className="product-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button
                className="btn btn-primary product-info__add-btn"
                onClick={() => addItem(product, qty, selectedSize, selectedColor)}
              >
                <FiShoppingBag size={18}/> Shto në Shportë
              </button>
              <button 
                className={`product-info__wish-btn ${liked ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                style={{ color: liked ? 'var(--gold)' : 'inherit' }}
              >
                <FiHeart size={20} fill={liked ? 'var(--gold)' : 'none'} />
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="product-feature"><FiCheck size={14}/> Transport falas mbi 50€</div>
              <div className="product-feature"><FiTruck size={14}/> Dërgim brenda 2-3 ditëve</div>
              <div className="product-feature"><FiCheck size={14}/> Kthim i lirë brenda 30 ditëve</div>
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <p className="product-info__stock">
                {product.stock > 10 ? (
                  <><FiCheck size={13} color="var(--success)"/> <span style={{color:'var(--success)'}}>Në stok</span></>
                ) : product.stock > 0 ? (
                  <span style={{color:'var(--warning)', display:'flex', alignItems:'center', gap:4}}><FiAlertTriangle size={13}/> Vetëm {product.stock} të mbetura!</span>
                ) : (
                  <span style={{color:'var(--error)', display:'flex', alignItems:'center', gap:4}}><FiX size={13}/> Jashtë stoku</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section style={{marginTop:80}}>
            <div className="section-header">
              <div>
                <p className="section-label">Të ngjashme</p>
                <h2 className="section-title">Mund t'ju Pëlqejë</h2>
              </div>
            </div>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
