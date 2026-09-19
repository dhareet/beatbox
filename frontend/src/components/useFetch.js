import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api.js';

export default function useFetch(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    return apiFetch(path)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [path]);

  useEffect(() => { load(); }, [load]);

  return { data, error, loading, reload: load, setData };
}
