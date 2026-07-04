import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearAuthToken, setAuthToken } from '../utils/auth';

const initialForm = { name: '', email: '', password: '' };

function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      clearAuthToken();
      const payload = mode === 'signup'
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const response = await axios.post(endpoint, payload);
      setAuthToken(response.data.token);
      navigate('/profile');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell auth-page">
      <section className="hero-panel auth-hero">
        <div>
          <p className="eyebrow">Account access</p>
          <h1>{mode === 'signup' ? 'Create your PunjabiLingo account' : 'Sign in to your PunjabiLingo account'}</h1>
          <p className="lead">
            This is the real auth flow. It talks to the backend, stores a JWT, and unlocks live profile, village,
            skill tree, and leaderboard data.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-toggle">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
              Sign in
            </button>
            <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
              Sign up
            </button>
          </div>

          {mode === 'signup' && (
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </label>

          {error && <p className="hint">{error}</p>}

          <button className="btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? 'Working...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Auth;