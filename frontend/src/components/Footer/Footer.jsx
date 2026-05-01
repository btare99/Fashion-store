import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">
                <span className="footer__logo-text">LUXE</span>
                <span className="footer__logo-sub">STORE</span>
              </div>
              <p className="footer__tagline">Fashion e paharrueshme. Stili juaj, zgjedhja juaj.</p>
              <div className="footer__socials">
                <a href="#" className="footer__social"><FiInstagram size={18}/></a>
                <a href="#" className="footer__social"><FiFacebook size={18}/></a>
                <a href="#" className="footer__social"><FiYoutube size={18}/></a>
              </div>
            </div>
            {/* Links */}
            <div className="footer__col">
              <h4 className="footer__heading">Kategoritë</h4>
              <ul className="footer__list">
                {['Këpucë', 'Rroba Burra', 'Rroba Gra', 'Aksesorë', 'Çanta', 'Sporte', 'Fëmijë'].map(c => (
                  <li key={c}>
                    <Link to={`/products?category=${encodeURIComponent(c)}`} className="footer__link">{c}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer__col">
              <h4 className="footer__heading">Informacion</h4>
              <ul className="footer__list">
                <li><Link to="/rreth-nesh" className="footer__link">Rreth Nesh</Link></li>
                <li><Link to="/politika-privatesise" className="footer__link">Politika e Privatësisë</Link></li>
                <li><Link to="/kushtet-perdorimit" className="footer__link">Kushtet e Përdorimit</Link></li>
                <li><Link to="/kthim-rimbursim" className="footer__link">Kthim & Rimbursim</Link></li>
                <li><Link to="/faq" className="footer__link">FAQ</Link></li>
              </ul>
            </div>
            {/* Contact */}
            <div className="footer__col">
              <h4 className="footer__heading">Kontakti</h4>
              <ul className="footer__contact">
                <li><FiPhone size={14}/> <span>+383 44 000 000</span></li>
                <li><FiMail size={14}/> <span>btare99@gmail.com</span></li>
                <li><FiMapPin size={14}/> <span>Prishtinë, Kosovë</span></li>
              </ul>
              <div className="footer__newsletter">
                <p>Regjistrohu për oferta ekskluzive:</p>
                <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
                  <input type="email" placeholder="Email-i juaj..." className="footer__newsletter-input" />
                  <button type="submit" className="footer__newsletter-btn">→</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} LUXE Store. Të gjitha të drejtat e rezervuara.</p>
          <div className="footer__payments">
            <span style={{display:'flex',alignItems:'center',gap:4}}><FiCreditCard size={14}/> Visa</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><FiCreditCard size={14}/> Mastercard</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><FiDollarSign size={14}/> Para në dorë</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
