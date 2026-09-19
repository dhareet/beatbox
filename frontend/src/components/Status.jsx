// Renders loading / error states so pages never touch undefined data
export default function Status({ loading, error }) {
  if (loading) return <p className="empty">Loading…</p>;
  if (error) return <p className="error">{error}</p>;
  return null;
}
