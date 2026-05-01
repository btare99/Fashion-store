import { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './Admin.css';

const STATUSES = ['Të gjitha', 'Në pritje', 'Konfirmuar', 'Dërguar', 'Dorëzuar', 'Anuluar'];
const STATUS_MAP = { 'Në pritje':'pending','Konfirmuar':'confirmed','Dërguar':'shipped','Dorëzuar':'delivered','Anuluar':'cancelled' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await ordersAPI.getAll(params);
      setOrders(res.data);
    } catch { toast.error('Gabim duke ngarkuar porositë'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filterStatus]);

  const handleStatus = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Statusi u ndryshua!');
    } catch { toast.error('Gabim gjatë ndryshimit'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Fshi këtë porosi?')) return;
    try {
      await ordersAPI.delete(id);
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.success('Porosia u fshi');
    } catch { toast.error('Gabim gjatë fshirjes'); }
  };

  return (
    <div className="admin-orders page-enter">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Porositë</h1>
          <p className="admin-page__subtitle">{orders.length} porosi gjithsej</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s === 'Të gjitha' ? '' : s)}
            className={`btn ${(filterStatus === s || (s === 'Të gjitha' && !filterStatus)) ? 'btn-primary' : 'btn-outline'}`}
            style={{padding:'8px 16px',fontSize:'0.82rem'}}
          >{s}</button>
        ))}
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {Array(6).fill(0).map((_,i)=><div key={i} className="skeleton" style={{height:60,borderRadius:8}}/>)}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state" style={{padding:'60px 0'}}>
            <div className="empty-state-icon">📭</div>
            <h3>Nuk ka porosi</h3>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {orders.map(order => (
              <div key={order._id} style={{borderBottom:'1px solid var(--border)'}}>
                {/* Order Row */}
                <div
                  style={{display:'flex',alignItems:'center',gap:16,padding:'16px 4px',cursor:'pointer',transition:'var(--transition)'}}
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <FiChevronDown size={16} style={{color:'var(--text-muted)',transform: expanded===order._id?'rotate(180deg)':'none',transition:'0.2s'}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                      <strong style={{color:'var(--gold)',fontSize:'0.88rem'}}>{order.orderNumber}</strong>
                      <span style={{color:'var(--text-primary)',fontSize:'0.88rem'}}>{order.customer.firstName} {order.customer.lastName}</span>
                      <span style={{color:'var(--text-muted)',fontSize:'0.78rem'}}>{order.customer.phone}</span>
                    </div>
                    <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:3}}>
                      {new Date(order.createdAt).toLocaleString('sq-AL')} · {order.items.length} artikuj
                    </div>
                  </div>
                  <span style={{color:'var(--gold)',fontWeight:700,fontSize:'0.95rem',whiteSpace:'nowrap'}}>{order.total.toFixed(2)} €</span>
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); handleStatus(order._id, e.target.value); }}
                    onClick={e => e.stopPropagation()}
                    className={`status-badge status-badge--${STATUS_MAP[order.status]||'pending'}`}
                    style={{appearance:'none',cursor:'pointer',border:'none',outline:'none',fontWeight:700,fontSize:'0.72rem',letterSpacing:'0.5px',padding:'5px 10px',borderRadius:'9999px'}}
                  >
                    {STATUSES.filter(s=>s!=='Të gjitha').map(s=><option key={s}>{s}</option>)}
                  </select>
                  <button className="btn btn-danger" style={{padding:'6px 10px'}} onClick={e=>{e.stopPropagation();handleDelete(order._id);}}>
                    <FiTrash2 size={13}/>
                  </button>
                </div>

                {/* Expanded Details */}
                {expanded === order._id && (
                  <div style={{padding:'0 20px 20px',background:'var(--bg-elevated)',borderTop:'1px solid var(--border)',animation:'slideUpFade 0.2s ease'}}>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,paddingTop:16}}>
                      <div>
                        <p style={{fontSize:'0.72rem',color:'var(--gold)',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,marginBottom:10}}>Klienti</p>
                        {[
                          ['Email', order.customer.email],
                          ['Telefon', order.customer.phone],
                          ['Adresa', order.customer.address],
                          ['Qyteti', order.customer.city],
                          order.customer.notes && ['Shënime', order.customer.notes],
                        ].filter(Boolean).map(([k,v])=>(
                          <div key={k} style={{display:'flex',gap:8,marginBottom:6,fontSize:'0.83rem'}}>
                            <span style={{color:'var(--text-muted)',minWidth:70}}>{k}:</span>
                            <span style={{color:'var(--text-primary)'}}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p style={{fontSize:'0.72rem',color:'var(--gold)',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,marginBottom:10}}>Produktet</p>
                        {order.items.map((item, i) => (
                          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:'0.83rem'}}>
                            <span style={{color:'var(--text-primary)'}}>{item.name} {item.size && `(${item.size})`} ×{item.quantity}</span>
                            <span style={{color:'var(--gold)',fontWeight:600}}>{(item.price*item.quantity).toFixed(2)} €</span>
                          </div>
                        ))}
                        <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0 0',fontWeight:700,color:'var(--text-primary)',fontSize:'0.9rem'}}>
                          <span>Total:</span><span style={{color:'var(--gold)'}}>{order.total.toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
