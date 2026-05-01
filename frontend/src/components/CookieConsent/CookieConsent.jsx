import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import './CookieConsent.css';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('luxe_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('luxe_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <div className="cookie-consent__text">
          Ne përdorim cookies për të përmirësuar eksperiencën tuaj. Duke vazhduar vizitën në këtë faqe, ju pranoni përdorimin e cookies sipas{' '}
          <Link to="/politika-privatesise">Politikës së Privatësisë</Link>.
        </div>
        <div className="cookie-consent__actions">
          <button className="btn btn-primary" onClick={handleAccept} style={{padding: '8px 20px', fontSize: '0.85rem'}}>Pranoj</button>
          <button className="cookie-consent__close" onClick={() => setIsVisible(false)}><FiX size={20} /></button>
        </div>
      </div>
    </div>
  );
}
