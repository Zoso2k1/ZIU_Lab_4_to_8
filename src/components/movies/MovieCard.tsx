TypeScript
import React, { useState, useCallback } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import type { Movie } from '../../hooks/useFetchMovies';
import { useTracking } from '../../hooks/useTracking';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props { movie: Movie; }

export function MovieCard({ movie }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { trackEvent } = useTracking(); // <-- 2. INICJALIZACJA HOOKA
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);
  
  const displayedFav = optimisticFav ?? isFavorite(movie.id);

  const handleToggle = useCallback(async () => {
    // <-- 3. ŚLEDZENIE KLIKNIĘCIA
    trackEvent(displayedFav ? 'remove_from_favorites' : 'add_to_favorites', {
      movieId: movie.id,
      movieTitle: movie.title
    });

    setOptimisticFav(!displayedFav);
    try {
      await toggleFavorite(movie);
      setOptimisticFav(null);
    } catch {
      setOptimisticFav(null);
    }
  }, [displayedFav, toggleFavorite, movie, trackEvent]); // pamiętaj dodać trackEvent do zależności

  return (
    <div className='movie-card' style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
      <img
        src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Brak+plakatu'}
        alt={`Plakat filmu ${movie.title}`}
        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
      />
      <h3 style={{ fontSize: '1.1rem', margin: '10px 0' }}>{movie.title}</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>{movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average.toFixed(1)}</p>
      
      <button
        onClick={handleToggle}
        aria-label={displayedFav ? `Usuń film ${movie.title} z ulubionych` : `Dodaj film ${movie.title} do ulubionych`}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}
      >
        {displayedFav ? '❤️' : '🤍'}
      </button>
    </div>
  );
}