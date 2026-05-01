import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiStar, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { productsAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './HomePage.css';

const HERO_SLIDES = [
  {
    title: 'Koleksioni\ni Verës',
    subtitle: '2025',
    desc: 'Zbulo stilin tënd me koleksionin tonë ekskluziv. Fashion premium, çmime të arsyeshme.',
    cta: 'Eksploro Tani',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    accent: '#c9a96e',
  },
  {
    title: 'Stili\njuaj,',
    subtitle: 'Çdo ditë',
    desc: 'Nga kepucët premium deri te aksesmoret më trendy. Gjithçka brenda një dyqani.',
    cta: 'Shiko Koleksionin',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    accent: '#8b5cf6',
  },
  {
    title: 'Ofertat\ne Sezonit',
    subtitle: 'Deri -40%',
    desc: 'Cilësia më e mirë me çmimin më të mirë. Shpejto, oferta është e kufizuar.',
    cta: 'Shiko Ofertat',
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
    accent: '#f87171',
  },
];

const CATEGORIES = [
  { name: 'Këpucë', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', count: '200+' },
  { name: 'Rroba Burra', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', count: '350+' },
  { name: 'Rroba Gra', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', count: '500+' },
  { name: 'Aksesorë', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80', count: '150+' },
  { name: 'Çanta', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', count: '100+' },
  { name: 'Sporte', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80', count: '180+' },
];

const FEATURES = [
  { icon: <FiTruck size={22} />, title: 'Transport Falas', desc: 'Për porosi mbi 50€' },
  { icon: <FiShield size={22} />, title: 'Produkte Origjinale', desc: '100% produkte autentike' },
  { icon: <FiRefreshCw size={22} />, title: 'Kthim i Lehtë', desc: 'Brenda 30 ditëve' },
  { icon: <FiStar size={22} />, title: 'Cilësi Premium', desc: 'Brendet më të mira' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  // Auto-slide
  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const goSlide = (idx) => {
    clearInterval(intervalRef.current);
    setSlide(idx);
    intervalRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [feat, newP, sale] = await Promise.all([
          productsAPI.getAll({ isFeatured: true }),
          productsAPI.getAll({ isNewUser: true }),
          productsAPI.getAll({ isSale: true }),
        ]);
        setFeaturedProducts(feat.data.slice(0, 8));
        setNewProducts(newP.data.slice(0, 4));
        setSaleProducts(sale.data.slice(0, 4));
      } catch {
        // Use sample data if API not available
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <main className="home page-enter">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div
          className="hero__bg"
          style={{ backgroundImage: `url(${current.img})` }}
          key={slide}
        />
        <div className="hero__overlay" />
        <div className="hero__content container">
          <div className="hero__text" key={`text-${slide}`}>
            <div className="hero__label">Koleksioni i Ri · 2025</div>
            <h1 className="hero__title">
              {current.title}<br />
              <span className="hero__title-accent" style={{ color: current.accent }}>
                {current.subtitle}
              </span>
            </h1>
            <p className="hero__desc">{current.desc}</p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-primary hero__cta">
                {current.cta} <FiArrowRight size={16} />
              </Link>
              <Link to="/products?isSale=true" className="btn btn-outline hero__cta-sec">
                Shiko Ofertat
              </Link>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <button className="hero__arrow hero__arrow--left" onClick={() => goSlide((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}>
          <FiChevronLeft size={22} />
        </button>
        <button className="hero__arrow hero__arrow--right" onClick={() => goSlide((slide + 1) % HERO_SLIDES.length)}>
          <FiChevronRight size={22} />
        </button>
        <div className="hero__dots">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} className={`hero__dot ${i === slide ? 'active' : ''}`} onClick={() => goSlide(i)} />
          ))}
        </div>

        {/* Stats */}
        <div className="hero__stats">
          {[['10K+', 'Klientë'], ['500+', 'Produkte'], ['50+', 'Brende'], ['4.9★', 'Vlerësim']].map(([val, label]) => (
            <div key={label} className="hero__stat">
              <span className="hero__stat-val">{val}</span>
              <span className="hero__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES BAR ===== */}
      <section className="features-bar">
        <div className="container">
          <div className="features-bar__grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="features-bar__item">
                <div className="features-bar__icon">{f.icon}</div>
                <div>
                  <div className="features-bar__title">{f.title}</div>
                  <div className="features-bar__desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Zbulo</p>
              <h2 className="section-title">Kategoritë</h2>
            </div>
            <Link to="/products" className="btn btn-outline">Shiko të gjitha <FiArrowRight size={14}/></Link>
          </div>
          <div className="categories__grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <div className="category-card__img-wrap">
                  <img src={cat.img} alt={cat.name} className="category-card__img" loading="lazy" />
                  <div className="category-card__overlay" />
                </div>
                <div className="category-card__info">
                  <h3 className="category-card__name">{cat.name}</h3>
                  <p className="category-card__count">{cat.count} produkte</p>
                </div>
                <div className="category-card__arrow"><FiArrowRight size={16}/></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Zgjedhja jonë</p>
              <h2 className="section-title">Produktet e Zgjedhura</h2>
            </div>
            <Link to="/products?isFeatured=true" className="btn btn-outline">Shiko të gjitha <FiArrowRight size={14}/></Link>
          </div>
          {loading ? (
            <div className="products-skeleton">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{height: 380, borderRadius: 12}}/>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid">
              {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="home__no-products">
              <div className="empty-state">
                <div className="empty-state-icon">🏪</div>
                <h3>Dyqani po përgatitet...</h3>
                <p>Shto produktet e para nga paneli i administratorit</p>
                <Link to="/admin/login" className="btn btn-primary" style={{marginTop:16}}>
                  Hyr si Admin <FiArrowRight size={14}/>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section className="promo-banner">
        <div className="promo-banner__bg" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80)'}} />
        <div className="promo-banner__overlay" />
        <div className="container promo-banner__content">
          <div>
            <span className="tag tag-red" style={{marginBottom:16, display:'inline-flex'}}>⚡ Ofertë e Kufizuar</span>
            <h2 className="promo-banner__title">Gra Fashion Sale</h2>
            <p className="promo-banner__desc">Deri në 40% zbritje tek të gjitha veshjet e grave. Shpejto para se të mbarojë!</p>
            <Link to="/products?category=Rroba+Gra&isSale=true" className="btn btn-primary promo-banner__btn">
              Shiko Ofertat <FiArrowRight size={16}/>
            </Link>
          </div>
          <div className="promo-banner__badge">
            <span className="promo-banner__badge-val">40%</span>
            <span className="promo-banner__badge-label">ZBRITJE</span>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      {newProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-label">Arritjet e reja</p>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <Link to="/products?isNewUser=true" className="btn btn-outline">Shiko të gjitha <FiArrowRight size={14}/></Link>
            </div>
            <div className="products-grid products-grid--4">
              {newProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== BRANDS TICKER ===== */}
      <section className="brands-ticker">
        <div className="brands-ticker__track">
          {['Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Puma', 'Levi\'s', 'Tommy Hilfiger', 'Calvin Klein', 'Boss', 'Nike', 'Adidas', 'Zara', 'H&M', 'Gucci', 'Puma'].map((b, i) => (
            <span key={i} className="brands-ticker__item">{b}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
