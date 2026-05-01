import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiX, FiImage, FiZap, FiStar, FiTag } from 'react-icons/fi';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Admin.css';
import './AdminProductForm.css';

const CATEGORIES = ['Këpucë', 'Rroba Burra', 'Rroba Gra', 'Aksesorë', 'Çanta', 'Sporte', 'Fëmijë'];
const SIZE_PRESETS = {
  'Këpucë': ['36','37','38','39','40','41','42','43','44','45'],
  'Rroba Burra': ['XS','S','M','L','XL','XXL'],
  'Rroba Gra': ['XS','S','M','L','XL','XXL'],
  'Aksesorë': ['One Size'],
  'Çanta': ['One Size'],
  'Sporte': ['XS','S','M','L','XL','XXL'],
  'Fëmijë': ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y','12-13Y'],
};

const EMPTY = {
  name:'', description:'', price:'', originalPrice:'', category:'Këpucë',
  subcategory:'', brand:'', stock:'0', isNewUser:false, isFeatured:false, isSale:false,
  rating:'0', reviewCount:'0', sizes:[], colors:[], images:[], tags:'',
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState(EMPTY);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hex: '#c9a96e' });

  useEffect(() => {
    if (isEdit) {
      productsAPI.getById(id).then(res => {
        const p = res.data;
        setForm({ ...EMPTY, ...p, price: String(p.price), originalPrice: String(p.originalPrice||''), stock: String(p.stock), rating: String(p.rating), reviewCount: String(p.reviewCount), tags: (p.tags||[]).join(', ') });
        setImageUrls(p.images?.length ? p.images : ['']);
      }).catch(() => toast.error('Produkti nuk u gjet'));
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleSize = (s) => set('sizes', form.sizes.includes(s) ? form.sizes.filter(x=>x!==s) : [...form.sizes, s]);
  const addColor = () => {
    if (!newColor.name.trim()) return;
    set('colors', [...form.colors, { ...newColor }]);
    setNewColor({ name: '', hex: '#c9a96e' });
  };
  const removeColor = (i) => set('colors', form.colors.filter((_,idx)=>idx!==i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category) { toast.error('Plotëso fushat e detyrueshme'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      const validUrls = imageUrls.filter(u => u.trim());
      const data = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stock: Number(form.stock),
        rating: Number(form.rating),
        reviewCount: Number(form.reviewCount),
        images: imageFiles.length === 0 ? validUrls : undefined,
        tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
      };
      imageFiles.forEach(f => fd.append('images', f));
      fd.append('data', JSON.stringify(data));

      if (isEdit) await productsAPI.update(id, fd);
      else await productsAPI.create(fd);

      toast.success(isEdit ? 'Produkti u përditësua!' : 'Produkti u shtua!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gabim gjatë ruajtjes');
    } finally { setLoading(false); }
  };

  const sizePreset = SIZE_PRESETS[form.category] || ['XS','S','M','L','XL'];

  return (
    <div className="admin-product-form page-enter">
      <div className="admin-page__header">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button onClick={() => navigate('/admin/products')} className="btn btn-ghost" style={{padding:'8px 12px'}}>
            <FiArrowLeft size={18}/>
          </button>
          <div>
            <h1 className="admin-page__title">{isEdit ? 'Ndrysho Produktin' : 'Shto Produkt të Ri'}</h1>
            <p className="admin-page__subtitle">{form.name || 'Produkt i ri'}</p>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <><span className="spinner"/> Duke ruajtur...</> : (isEdit ? 'Ruaj Ndryshimet' : 'Shto Produktin')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="apf-grid">
        {/* Left Column */}
        <div className="apf-col">
          {/* Basic Info */}
          <div className="admin-card apf-section">
            <h3 className="apf-section__title">Informacioni Bazë</h3>
            <div className="apf-field">
              <label>Emri i Produktit *</label>
              <input className="input-field" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="p.sh. Nike Air Max 270" required/>
            </div>
            <div className="apf-field">
              <label>Përshkrimi *</label>
              <textarea className="input-field" value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Përshkrim i detajuar..." rows={4} style={{resize:'vertical'}}/>
            </div>
            <div className="apf-row">
              <div className="apf-field">
                <label>Kategoria *</label>
                <select className="input-field" value={form.category} onChange={e=>set('category',e.target.value)}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="apf-field">
                <label>Brendi</label>
                <input className="input-field" value={form.brand} onChange={e=>set('brand',e.target.value)} placeholder="Nike, Adidas..."/>
              </div>
            </div>
            <div className="apf-field">
              <label>Nënkategoria</label>
              <input className="input-field" value={form.subcategory} onChange={e=>set('subcategory',e.target.value)} placeholder="Sneakers, Formal..."/>
            </div>
            <div className="apf-field">
              <label>Etiketa (ndaj me presje)</label>
              <input className="input-field" value={form.tags} onChange={e=>set('tags',e.target.value)} placeholder="running, summer, casual"/>
            </div>
          </div>

          {/* Prices */}
          <div className="admin-card apf-section">
            <h3 className="apf-section__title">Çmimet & Stoku</h3>
            <div className="apf-row">
              <div className="apf-field">
                <label>Çmimi (€) *</label>
                <input className="input-field" type="number" step="0.01" min="0" value={form.price} onChange={e=>set('price',e.target.value)} required/>
              </div>
              <div className="apf-field">
                <label>Çmimi Origjinal (€)</label>
                <input className="input-field" type="number" step="0.01" min="0" value={form.originalPrice} onChange={e=>set('originalPrice',e.target.value)} placeholder="Për zbritje"/>
              </div>
              <div className="apf-field">
                <label>Stoku</label>
                <input className="input-field" type="number" min="0" value={form.stock} onChange={e=>set('stock',e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="admin-card apf-section">
            <h3 className="apf-section__title">Madhësitë</h3>
            <div className="apf-sizes">
              {sizePreset.map(s => (
                <button
                  key={s} type="button"
                  className={`apf-size-btn ${form.sizes.includes(s) ? 'active' : ''}`}
                  onClick={() => toggleSize(s)}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="admin-card apf-section">
            <h3 className="apf-section__title">Ngjyrat</h3>
            <div className="apf-colors-selected">
              {form.colors.map((c,i) => (
                <div key={i} className="apf-color-chip">
                  <span style={{width:16,height:16,borderRadius:'50%',background:c.hex,border:'1px solid rgba(255,255,255,0.2)',display:'inline-block'}}/>
                  {c.name}
                  <button type="button" onClick={()=>removeColor(i)}><FiX size={12}/></button>
                </div>
              ))}
            </div>
            <div className="apf-add-color">
              <input type="color" value={newColor.hex} onChange={e=>setNewColor(n=>({...n,hex:e.target.value}))} className="apf-color-picker"/>
              <input className="input-field" placeholder="Emri i ngjyrës" value={newColor.name} onChange={e=>setNewColor(n=>({...n,name:e.target.value}))} style={{flex:1}}/>
              <button type="button" className="btn btn-outline" onClick={addColor}><FiPlus size={15}/></button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="apf-col">
          {/* Images */}
          <div className="admin-card apf-section">
            <h3 className="apf-section__title"><FiImage size={16}/> Imazhet</h3>
            <p style={{fontSize:'0.78rem',color:'var(--text-muted)',marginBottom:14}}>Vendos URL-të e imazheve (nga Unsplash, etj.)</p>
            {imageUrls.map((url, i) => (
              <div key={i} className="apf-img-url-row">
                <input
                  className="input-field"
                  value={url}
                  onChange={e => { const u=[...imageUrls]; u[i]=e.target.value; setImageUrls(u); }}
                  placeholder={`https://images.unsplash.com/...`}
                  style={{flex:1}}
                />
                {url && <img src={url} alt="" style={{width:44,height:44,objectFit:'cover',borderRadius:6,border:'1px solid var(--border)'}} onError={e=>e.target.style.display='none'} onLoad={e=>e.target.style.display='block'}/>}
                {imageUrls.length > 1 && (
                  <button type="button" onClick={() => setImageUrls(imageUrls.filter((_,j)=>j!==i))} className="apf-img-remove"><FiX size={14}/></button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-outline" style={{width:'100%',marginTop:8,fontSize:'0.85rem'}} onClick={() => setImageUrls([...imageUrls, ''])}>
              <FiPlus size={14}/> Shto URL imazhi
            </button>
          </div>

          {/* Flags */}
          <div className="admin-card apf-section">
            <h3 className="apf-section__title">Statusi</h3>
            <div className="apf-toggles">
              {[
                { key:'isNewUser', label:<span style={{display:'flex',gap:6,alignItems:'center'}}><FiZap size={14}/> Produkt i Ri</span>, desc:'Shfaq badgën "New"' },
                { key:'isFeatured', label:<span style={{display:'flex',gap:6,alignItems:'center'}}><FiStar size={14}/> I Zgjedhur</span>, desc:'Shfaqet në homepage' },
                { key:'isSale', label:<span style={{display:'flex',gap:6,alignItems:'center'}}><FiTag size={14}/> Në Sale</span>, desc:'Aplikon zbritjen' },
              ].map(({ key, label, desc }) => (
                <label key={key} className={`apf-toggle ${form[key] ? 'active' : ''}`}>
                  <div>
                    <span className="apf-toggle__label">{label}</span>
                    <span className="apf-toggle__desc">{desc}</span>
                  </div>
                  <div className={`apf-toggle__switch ${form[key] ? 'on' : ''}`} onClick={() => set(key, !form[key])}>
                    <div className="apf-toggle__knob"/>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="admin-card apf-section">
            <h3 className="apf-section__title">Vlerësimi</h3>
            <div className="apf-row">
              <div className="apf-field">
                <label>Vlerësimi (0-5)</label>
                <input className="input-field" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e=>set('rating',e.target.value)}/>
              </div>
              <div className="apf-field">
                <label>Nr. Vlerësimeve</label>
                <input className="input-field" type="number" min="0" value={form.reviewCount} onChange={e=>set('reviewCount',e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Preview */}
          {imageUrls[0] && (
            <div className="admin-card apf-section" style={{textAlign:'center'}}>
              <h3 className="apf-section__title">Pamja Paraprake</h3>
              <img src={imageUrls[0]} alt="Preview" style={{width:'100%',maxHeight:280,objectFit:'cover',borderRadius:8,border:'1px solid var(--border)'}} onError={e=>e.target.style.display='none'}/>
              {form.name && <p style={{marginTop:10,fontWeight:600,color:'var(--text-primary)'}}>{form.name}</p>}
              {form.price && <p style={{color:'var(--gold)',fontWeight:700}}>{Number(form.price).toFixed(2)} €</p>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
