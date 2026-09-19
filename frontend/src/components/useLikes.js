import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function useLikes() {
  const [likedIds, setLikedIds] = useState(new Set());
  const toast = useToast();

  useEffect(() => {
    apiFetch('/users/me/liked')
      .then((rows) => setLikedIds(new Set(rows.map((r) => r.song_id))))
      .catch(() => {});
  }, []);

  const toggleLike = useCallback(async (songId) => {
    const wasLiked = likedIds.has(songId);
    const apply = (liked) =>
      setLikedIds((prev) => {
        const n = new Set(prev);
        liked ? n.add(songId) : n.delete(songId);
        return n;
      });

    apply(!wasLiked); // optimistic
    try {
      await apiFetch(`/songs/${songId}/like`, { method: wasLiked ? 'DELETE' : 'POST' });
      toast(wasLiked ? 'Removed from liked songs' : 'Added to liked songs');
    } catch {
      apply(wasLiked); // roll back
      toast('Could not update like. Try again.');
    }
  }, [likedIds, toast]);

  return { likedIds, toggleLike };
}
