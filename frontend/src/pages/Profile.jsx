import { useState } from 'react';
import { apiFetch } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useFetch from '../components/useFetch.js';
import Modal from '../components/Modal.jsx';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const history = useFetch('/users/me/history');
  const payments = useFetch('/users/me/payments');
  const [paying, setPaying] = useState(false);
  const [mode, setMode] = useState('card');
  const [busy, setBusy] = useState(false);

  const isPremium = user.subscription_type === 'premium';

  const pay = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      // Backend runs this in a DB transaction (insert payment + upgrade user)
      await apiFetch('/users/me/pay', { method: 'POST', body: JSON.stringify({ amount: 9.99, payment_mode: mode }) });
      await refreshUser();
      payments.reload();
      setPaying(false);
      toast('You are now on Premium');
    } catch (err) {
      toast(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2>Profile</h2>
      <div className="grid">
        <div className="card"><span className="muted">Name</span><strong>{user.name}</strong></div>
        <div className="card"><span className="muted">Email</span><strong>{user.email}</strong></div>
        <div className="card">
          <span className="muted">Plan</span>
          <strong>{isPremium ? 'Premium' : 'Free'}</strong>
          {!isPremium && <button className="btn small" onClick={() => setPaying(true)}>Upgrade to Premium</button>}
        </div>
      </div>

      <h3>Recently played</h3>
      {history.data && !history.data.length && <p className="empty">Nothing played yet.</p>}
      <div className="list">
        {(history.data || []).map((h, i) => (
          <div key={`${h.song_id}-${h.played_at ?? i}`} className="list-item">
            <span>{h.title} <em>{h.artist_name}</em></span>
            <span className="mono muted">{h.played_at ? new Date(h.played_at).toLocaleString() : ''}</span>
          </div>
        ))}
      </div>

      <h3>Payments</h3>
      {payments.data && !payments.data.length && <p className="empty">No payments yet.</p>}
      <div className="list">
        {(payments.data || []).map((p) => (
          <div key={p.payment_id} className="list-item">
            <span>{p.payment_mode}</span>
            <span className="mono">{p.amount}</span>
          </div>
        ))}
      </div>

      {paying && (
        <Modal title="Upgrade to Premium" onClose={() => setPaying(false)}>
          <form onSubmit={pay}>
            <p>Premium costs 9.99. Choose how you'd like to pay.</p>
            <label>Payment mode
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net banking</option>
              </select>
            </label>
            <div className="row end">
              <button type="button" className="btn ghost small" onClick={() => setPaying(false)}>Cancel</button>
              <button className="btn small" disabled={busy}>{busy ? 'Processing…' : 'Pay 9.99'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
