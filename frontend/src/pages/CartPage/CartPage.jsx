import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, shipping, total, count, clearCart } = useCart();

  if (items.length === 0) return (
    <main className="cart-page page-enter">
      <div className="container">
        <div className="empty-state" style={{paddingTop:60}}>
          <div className="empty-state-icon"><FiShoppingBag size={48}/></div>
          <h3>Shporta juaj është bosh</h3>
          <p>Shto produkte për të filluar blerjen</p>
          <Link to="/products" className="btn btn-primary" style={{marginTop:24}}>
            Shiko Produktet <FiArrowRight size={14}/>
          </Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="cart-page page-enter">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shporta <span>({count})</span></h1>
          <button className="btn btn-ghost" onClick={clearCart} style={{color:'var(--error)',fontSize:'0.82rem'}}>
            <FiTrash2 size={14}/> Pastro
          </button>
        </div>
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => {
              const key = `${item._id}-${item.selectedSize}-${item.selectedColor}`;
              const img = item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80';
              return (
                <div key={key} className="cart-item">
                  <Link to={`/products/${item._id}`} className="cart-item__img-wrap">
                    <img src={img} alt={item.name} className="cart-item__img"/>
                  </Link>
                  <div className="cart-item__info">
                    <Link to={`/products/${item._id}`} className="cart-item__name">{item.name}</Link>
                    <div className="cart-item__meta">
                      {item.selectedSize && <span>Madhësia: <strong>{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span>Ngjyra: <strong>{item.selectedColor}</strong></span>}
                    </div>
                    <span className="cart-item__price">{item.price.toFixed(2)} €</span>
                  </div>
                  <div className="cart-item__controls">
                    <div className="cart-item__qty">
                      <button onClick={() => updateQty(item._id, item.selectedSize, item.selectedColor, item.quantity - 1)}><FiMinus size={13}/></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item._id, item.selectedSize, item.selectedColor, item.quantity + 1)}><FiPlus size={13}/></button>
                    </div>
                    <span className="cart-item__subtotal">{(item.price * item.quantity).toFixed(2)} €</span>
                    <button className="cart-item__remove" onClick={() => removeItem(item._id, item.selectedSize, item.selectedColor)}>
                      <FiTrash2 size={15}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-summary">
            <h2 className="cart-summary__title">Rezymeja</h2>
            <div className="cart-summary__rows">
              <div className="cart-summary__row"><span>Nëntotali</span><span>{subtotal.toFixed(2)} €</span></div>
              <div className="cart-summary__row"><span>Transporti</span><span className={shipping===0?'cart-summary__free':''}>{shipping===0?'FALAS':`${shipping.toFixed(2)} €`}</span></div>
              {subtotal < 50 && subtotal > 0 && (
                <p className="cart-summary__note">Shto <strong>{(50-subtotal).toFixed(2)} €</strong> për transport falas!</p>
              )}
              <div className="cart-summary__row cart-summary__total"><span>Total</span><span>{total.toFixed(2)} €</span></div>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{width:'100%',marginTop:8}}>
              Vazhdo Porosinë <FiArrowRight size={15}/>
            </Link>
            <Link to="/products" className="btn btn-ghost" style={{width:'100%',marginTop:8,textAlign:'center'}}>← Vazhdo blerjet</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
