import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiStar, FiPackage } from 'react-icons/fi';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Admin.css';

const CATEGORIES = ['Të gjitha', 'Këpucë', 'Rroba Burra', 'Rroba Gra', 'Aksesorë', 'Çanta', 'Sporte', 'Fëmijë'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'Të gjitha') params.category = category;
      const res = await productsAPI.getAll(params);
      setProducts(res.data);
    } catch { toast.error('Gabim duke ngarkuar produktet'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [search, category]);

  const handleDelete = async (id) => {
    if (!window.confirm('Je i sigurt që dëshiron ta fshish këtë produkt?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Produkti u fshi!');
      setProducts(p => p.filter(x => x._id !== id));
    } catch { toast.error('Gabim gjatë fshirjes'); }
  };

  return (
    <div className="admin-products page-enter">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Produktet</h1>
          <p className="admin-page__subtitle">{products.length} produkte gjithsej</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-primary"><FiPlus size={16}/> Shto Produkt</Link>
      </div>

      {/* Filters */}
      <div className="admin-card" style={{marginBottom:20,display:'flex',gap:14,flexWrap:'wrap',alignItems:'center',padding:'16px 20px'}}>
        <div style={{flex:1,minWidth:200,display:'flex',alignItems:'center',gap:10,background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'8px 14px'}}>
          <FiSearch size={16} color="var(--text-muted)"/>
          <input
            type="text" placeholder="Kërko produkte..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{background:'none',border:'none',outline:'none',color:'var(--text-primary)',fontSize:'0.88rem',width:'100%'}}
          />
        </div>
        <select
          className="input-field"
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{width:'auto',padding:'9px 16px'}}
        >
          {CATEGORIES.map(c => <option key={c} value={c === 'Të gjitha' ? '' : c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="admin-card">
        {loading ? (
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {Array(8).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:56,borderRadius:8}}/>)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state" style={{padding:'60px 0'}}>
            <div className="empty-state-icon"><FiPackage size={48} color="var(--border)" /></div>
            <h3>Nuk u gjet asnjë produkt</h3>
            <Link to="/admin/products/new" className="btn btn-primary" style={{marginTop:16}}>
              <FiPlus size={14}/> Shto Produktin e Parë
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imazhi</th>
                  <th>Emri</th>
                  <th>Kategoria</th>
                  <th>Çmimi</th>
                  <th>Stoku</th>
                  <th>Vlerësimi</th>
                  <th>Statusi</th>
                  <th>Veprime</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{width:46,height:52,borderRadius:6,overflow:'hidden',background:'var(--bg-elevated)'}}>
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=60'}
                          alt={p.name}
                          style={{width:'100%',height:'100%',objectFit:'cover'}}
                        />
                      </div>
                    </td>
                    <td>
                      <span style={{color:'var(--text-primary)',fontWeight:600}}>{p.name}</span>
                      {p.brand && <span style={{display:'block',fontSize:'0.75rem',color:'var(--text-muted)'}}>{p.brand}</span>}
                    </td>
                    <td><span className="tag tag-gold">{p.category}</span></td>
                    <td style={{color:'var(--gold)',fontWeight:700}}>
                      {p.price.toFixed(2)} €
                      {p.originalPrice && <span style={{display:'block',fontSize:'0.75rem',color:'var(--text-muted)',textDecoration:'line-through'}}>{p.originalPrice.toFixed(2)} €</span>}
                    </td>
                    <td style={{color: p.stock === 0 ? 'var(--error)' : p.stock < 5 ? 'var(--warning)' : 'var(--success)'}}>{p.stock}</td>
                    <td>
                      {p.rating > 0 ? (
                        <span style={{display:'flex',alignItems:'center',gap:4,color:'var(--gold)'}}>
                          <FiStar size={12} fill="currentColor"/> {p.rating.toFixed(1)}
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                        {p.isNewUser && <span className="tag tag-green">New</span>}
                        {p.isSale && <span className="tag tag-red">Sale</span>}
                        {p.isFeatured && <span className="tag tag-gold"><FiStar size={12}/></span>}
                        {!p.isNewUser && !p.isSale && !p.isFeatured && <span style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>—</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{display:'flex',gap:8}}>
                        <Link to={`/admin/products/edit/${p._id}`} className="btn btn-outline" style={{padding:'6px 12px',fontSize:'0.8rem'}}>
                          <FiEdit2 size={13}/>
                        </Link>
                        <button className="btn btn-danger" style={{padding:'6px 12px',fontSize:'0.8rem'}} onClick={() => handleDelete(p._id)}>
                          <FiTrash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
