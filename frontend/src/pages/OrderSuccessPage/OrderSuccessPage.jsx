import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiShoppingBag, FiTruck, FiMail, FiDollarSign } from 'react-icons/fi';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const orderNumber = state?.orderNumber || 'N/A';

  return (
    <main className="success-page page-enter">
      <div className="container">
        <div className="success-card">
          <div className="success-card__icon"><FiCheckCircle size={64}/></div>
          <div className="success-card__confetti">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="confetti-piece" style={{ '--i': i }} />
            ))}
          </div>
          <h1 className="success-card__title">Porosia u Krye!</h1>
          <p className="success-card__desc">
            Faleminderit për blerjen tuaj! Porosia juaj u regjistrua me sukses dhe do të merrni një email konfirmimi së shpejti.
          </p>
          <div className="success-card__order">
            <span className="success-card__order-label">Numri i Porosisë</span>
            <span className="success-card__order-number">#{orderNumber}</span>
          </div>
          <div className="success-card__info">
            <div className="success-card__info-item"><FiTruck size={18}/> <span>Dërgim brenda 2-3 ditëve pune</span></div>
            <div className="success-card__info-item"><FiMail size={18}/> <span>Email konfirmimi u dërgua</span></div>
            <div className="success-card__info-item"><FiDollarSign size={18}/> <span>Pagesë me para në dorë</span></div>
          </div>
          <div className="success-card__actions">
            <Link to="/" className="btn btn-primary"><FiHome size={16}/> Kthehu në Kryefaqe</Link>
            <Link to="/products" className="btn btn-outline"><FiShoppingBag size={16}/> Vazhdo Blerjet</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
