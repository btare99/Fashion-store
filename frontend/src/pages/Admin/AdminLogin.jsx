import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { adminAPI } from '../../services/api';
import { FiLock, FiUser } from 'react-icons/fi';
import './Admin.css';

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [setup, setSetup] = useState({ username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await adminAPI.login(form);
      login(res.data.token, res.data.username);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Kredencialet janë të gabuara');
    } finally { setLoading(false); }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await adminAPI.setup(setup);
      setShowSetup(false);
      setError('');
      alert('Admin u krijua! Tani mund të hysh.');
    } catch (err) {
      setError(err.response?.data?.error || 'Gabim gjatë krijimit të adminit');
    } finally { setLoading(false); }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-card__logo">LUXE</div>
        <div className="admin-login-card__sub">Store · Admin Panel</div>
        <h1 className="admin-login-card__title">
          {showSetup ? 'Krijo Adminstratorin' : 'Hyr si Administrator'}
        </h1>

        {error && <div className="admin-login-error" style={{marginBottom:16}}>{error}</div>}

        {!showSetup ? (
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label><FiUser size={13}/> Përdoruesi</label>
              <input className="input-field" value={form.username} onChange={e => setForm(f=>({...f,username:e.target.value}))} placeholder="admin" required/>
            </div>
            <div className="form-group">
              <label><FiLock size={13}/> Fjalëkalimi</label>
              <input className="input-field" type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required/>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:8}} disabled={loading}>
              {loading ? 'Duke hyrë...' : 'Hyr në Panel'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetup} className="admin-login-form">
            <div className="form-group">
              <label>Emri i Përdoruesit</label>
              <input className="input-field" value={setup.username} onChange={e => setSetup(s=>({...s,username:e.target.value}))} placeholder="admin" required/>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="input-field" type="email" value={setup.email} onChange={e => setSetup(s=>({...s,email:e.target.value}))} placeholder="admin@luxe.com" required/>
            </div>
            <div className="form-group">
              <label>Fjalëkalimi</label>
              <input className="input-field" type="password" value={setup.password} onChange={e => setSetup(s=>({...s,password:e.target.value}))} placeholder="Min 6 karaktere" required minLength={6}/>
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:8}} disabled={loading}>
              {loading ? 'Po krijohet...' : 'Krijo Admin'}
            </button>
          </form>
        )}

        <div className="admin-login-setup">
          <p>Herë e parë?</p>
          <button className="btn btn-outline" style={{width:'100%',fontSize:'0.85rem'}} onClick={() => setShowSetup(!showSetup)}>
            {showSetup ? '← Kthehu te hyrja' : 'Konfiguro Admin-in e parë'}
          </button>
        </div>
      </div>
    </div>
  );
}
