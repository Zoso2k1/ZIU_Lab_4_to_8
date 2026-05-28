import { useState, useCallback } from 'react';
import type { Movie } from './useFetchMovies';
import type { Toast } from '../components/common/ToastContainer';

const STORAGE_KEY = 'movie-browser-favorites';

function loadFavorites(): Movie[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function useFavorites(onAddToast?: (msg: string) => void) {
  const [favorites, setFavorites] = useState<Movie[]>(loadFavorites);

  const updateFavoritesList = useCallback((next: Movie[]) => {
    setFavorites(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const toggleFavorite = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      const isFav = prev.some((m) => m.id === movie.id);
      let next: Movie[];
      
      if (isFav) {
        next = prev.filter((m) => m.id !== movie.id);
        if (onAddToast) onAddToast(`Usunięto z ulubionych: ${movie.title}`);
      } else {
        next = [...prev, movie];
        if (onAddToast) onAddToast(`Dodano do ulubionych: ${movie.title}`);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [onAddToast]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, setFavorites: updateFavoritesList };
}