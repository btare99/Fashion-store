import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiPhone, FiMail, FiFileText, FiArrowRight, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const initialForm = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', zipCode: '', notes: '',
};

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Emri është i detyrueshëm';
    if (!form.lastName.trim()) e.lastName = 'Mbiemri është i detyrueshëm';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email i pavlefshëm';
    if (!form.phone.trim()) e.phone = 'Numri i telefonit është i detyrueshëm';
    if (!form.address.trim()) e.address = 'Adresa është e detyrueshme';
    if (!form.city.trim()) e.city = 'Qyteti është i detyrueshëm';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Plotëso të gjitha fushat e detyrueshme'); return; }
    if (items.length === 0) { toast.error('Shporta është bosh'); return; }
    setLoading(true);
    try {
      const orderData = {
        customer: form,
        items: items.map(i => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          size: i.selectedSize,
          color: i.selectedColor,
          image: i.images?.[0] || '',
        })),
        subtotal,
        shipping,
        total,
        paymentMethod: 'Para në dorë',
      };
      const res = await ordersAPI.create(orderData);
      clearCart();
      navigate('/order-success', { state: { orderNumber: res.data.orderNumber } });
    } catch {
      toast.error('Ndodhi një gabim. Provo sërish!');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const Field = ({ name, label, icon, type = 'text', placeholder, full }) => (
    <div className={`checkout-field ${full ? 'checkout-field--full' : ''}`}>
      <label className="checkout-field__label">{icon} {label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input-field ${errors[name] ? 'input-field--error' : ''}`}
      />
      {errors[name] && <span className="checkout-field__error">{errors[name]}</span>}
    </div>
  );

  return (
    <main className="checkout-page page-enter">
      <div className="container">
        <h1 className="checkout-page__title">Finalizo Porosinë</h1>
        <div className="checkout-layout">
          {/* Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-section">
              <h2 className="checkout-section__title"><FiUser size={18}/> Informacioni Personal</h2>
              <div className="checkout-grid">
                <Field name="firstName" label="Emri *" placeholder="Emri juaj" />
                <Field name="lastName" label="Mbiemri *" placeholder="Mbiemri juaj" />
                <Field name="email" label="Email *" type="email" placeholder="email@shembull.com" />
                <Field name="phone" label="Telefon *" placeholder="+383 44 000 000" />
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="checkout-section__title"><FiMapPin size={18}/> Adresa e Dërgimit</h2>
              <div className="checkout-grid">
                <Field name="address" label="Adresa *" placeholder="Rruga dhe numri" full />
                <Field name="city" label="Qyteti *" placeholder="Prishtinë" />
                <Field name="zipCode" label="Kodi Postar" placeholder="10000" />
                <div className="checkout-field checkout-field--full">
                  <label className="checkout-field__label"><FiFileText size={14}/> Shënime</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Instruksione speciale për dërgim..."
                    className="input-field"
                    rows={3}
                    style={{resize:'vertical'}}
                  />
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="checkout-section__title"><FiCreditCard size={18} style={{marginRight:8}}/> Mënyra e Pagesës</h2>
              <div className="checkout-payment-option active">
                <FiDollarSign size={24} style={{marginRight:12}}/>
                <div>
                  <strong>Para në Dorë</strong>
                  <p>Paguani kur t'ju dorëzohet porosia</p>
                </div>
                <div className="checkout-payment-check">✓</div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary checkout-submit" disabled={loading}>
              {loading ? (
                <><span className="spinner"/>Duke dërguar...</>
              ) : (
                <>Konfirmo Porosinë <FiArrowRight size={16}/></>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2 className="checkout-summary__title">Porosia Juaj</h2>
            <div className="checkout-summary__items">
              {items.map(item => (
                <div key={`${item._id}-${item.selectedSize}`} className="checkout-summary__item">
                  <div className="checkout-summary__item-img">
                    <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80'} alt={item.name}/>
                    <span className="checkout-summary__item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout-summary__item-info">
                    <span className="checkout-summary__item-name">{item.name}</span>
                    {item.selectedSize && <span className="checkout-summary__item-meta">{item.selectedSize}</span>}
                  </div>
                  <span className="checkout-summary__item-price">{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__totals">
              <div className="checkout-summary__row"><span>Nëntotali</span><span>{subtotal.toFixed(2)} €</span></div>
              <div className="checkout-summary__row">
                <span>Transport</span>
                <span style={{color: shipping===0?'var(--success)':'inherit'}}>{shipping===0?'Falas':`${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
