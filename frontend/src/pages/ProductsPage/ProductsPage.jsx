import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiSearch, FiTag, FiZap, FiStar } from 'react-icons/fi';
import { productsAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['Këpucë', 'Rroba Burra', 'Rroba Gra', 'Aksesorë', 'Çanta', 'Sporte', 'Fëmijë'];
const SORT_OPTIONS = [
  { value: '', label: 'Më të rejat' },
  { value: 'price_asc', label: 'Çmimi: i ulët → i lartë' },
  { value: 'price_desc', label: 'Çmimi: i lartë → i ulët' },
  { value: 'name', label: 'Emri: A → Z' },
  { value: 'rating', label: 'Vlerësimi' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // Filters from URL
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const isSale = searchParams.get('isSale') === 'true';
  const isFeatured = searchParams.get('isFeatured') === 'true';
  const isNewUser = searchParams.get('isNewUser') === 'true';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || search || isSale || isFeatured || isNewUser || minPrice || maxPrice;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { category, search, sort, isSale: isSale || undefined, isFeatured: isFeatured || undefined, isNewUser: isNewUser || undefined, minPrice, maxPrice };
        const res = await productsAPI.getAll(params);
        setProducts(res.data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [category, search, sort, isSale, isFeatured, isNewUser, minPrice, maxPrice]);

  return (
    <main className="products-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="products-page__header">
          <div>
            <h1 className="products-page__title">
              {category ? category : search ? `Rezultate për "${search}"` : 'Të gjitha Produktet'}
            </h1>
            <p className="products-page__count">{products.length} produkte</p>
          </div>
          <div className="products-page__controls">
            <button className={`btn btn-outline products-page__filter-btn ${filterOpen ? 'active' : ''}`} onClick={() => setFilterOpen(!filterOpen)}>
              <FiFilter size={16}/> Filtro {filterOpen ? <FiX size={14}/> : <FiChevronDown size={14}/>}
            </button>
            <select className="input-field products-page__sort" value={sort} onChange={e => setParam('sort', e.target.value)} style={{width:'auto',padding:'10px 16px'}}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="products-page__body">
          {/* Sidebar Filters */}
          <aside className={`products-filters ${filterOpen ? 'products-filters--open' : ''}`}>
            <div className="products-filters__inner">
              <div className="products-filters__header">
                <h3>Filtro</h3>
                {hasFilters && <button className="btn btn-ghost" onClick={clearFilters} style={{fontSize:'0.8rem',padding:'4px 8px'}}>Pastro të gjitha</button>}
              </div>

              {/* Search */}
              <div className="filter-group">
                <label className="filter-group__label">Kërko</label>
                <div className="filter-search">
                  <FiSearch size={14} />
                  <input
                    type="text"
                    placeholder="Kërko produktin..."
                    value={search}
                    onChange={e => setParam('search', e.target.value)}
                    className="filter-search__input"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="filter-group">
                <label className="filter-group__label">Kategoria</label>
                <div className="filter-options">
                  <button
                    className={`filter-option ${!category ? 'active' : ''}`}
                    onClick={() => setParam('category', '')}
                  >Të gjitha</button>
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      className={`filter-option ${category === c ? 'active' : ''}`}
                      onClick={() => setParam('category', c === category ? '' : c)}
                    >{c}</button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <label className="filter-group__label">Çmimi (€)</label>
                <div className="filter-price">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setParam('minPrice', e.target.value)} className="input-field" style={{fontSize:'0.85rem',padding:'8px 12px'}}/>
                  <span>—</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setParam('maxPrice', e.target.value)} className="input-field" style={{fontSize:'0.85rem',padding:'8px 12px'}}/>
                </div>
              </div>

              {/* Special filters */}
              <div className="filter-group">
                <label className="filter-group__label">Speciale</label>
                <div className="filter-toggles">
                  {[
                    { key: 'isSale', label: <span style={{display:'flex',gap:6,alignItems:'center'}}><FiTag size={14}/> Në Sale</span>, val: isSale },
                    { key: 'isNewUser', label: <span style={{display:'flex',gap:6,alignItems:'center'}}><FiZap size={14}/> Të Reja</span>, val: isNewUser },
                    { key: 'isFeatured', label: <span style={{display:'flex',gap:6,alignItems:'center'}}><FiStar size={14}/> Të Zgjedhura</span>, val: isFeatured },
                  ].map(({ key, label, val }) => (
                    <button
                      key={key}
                      className={`filter-toggle ${val ? 'active' : ''}`}
                      onClick={() => setParam(key, val ? '' : 'true')}
                    >{label}</button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="products-page__main">
            {loading ? (
              <div className="products-grid">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="skeleton" style={{height:380, borderRadius:12}}/>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><FiSearch size={48} color="var(--border)" /></div>
                <h3>Nuk u gjet asnjë produkt</h3>
                <p>Provo filtra të ndryshëm ose pastro filtrat</p>
                <button className="btn btn-outline" onClick={clearFilters} style={{marginTop:16}}>Pastro filtrat</button>
              </div>
            ) : (
              <div className={`products-grid ${filterOpen ? 'products-grid--3' : ''}`}>
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
