import React, { useState } from 'react';
import { motion, Reorder, useReducedMotion } from 'framer-motion';
import { useFetchMovies } from '../../hooks/useFetchMovies';
import { useDebounce } from '../../hooks/useDebounce';
import { useFavorites } from '../../hooks/useFavorites';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';
import { ToastContainer, type Toast } from '../common/ToastContainer';

// Warianty dla animacji Stagger (Krok C)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export function MovieBrowser() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const shouldReduce = useReducedMotion(); // Obsługa a11y

  const addToast = (message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading, isError, error, isPlaceholderData } = useFetchMovies(page, debouncedQuery);
  const { favorites, toggleFavorite, setFavorites } = useFavorites(addToast);

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <section aria-labelledby="movie-browser-title">
      <h2 id="movie-browser-title">Przeglądarka Filmów (TMDB API)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="movie-search">Wyszukaj film: </label>
        <input
          id="movie-search"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Wpisz min. 2 znaki..."
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      {/* REORDER LISTA: Ulubione Drag & Drop (Krok C) */}
      {favorites.length > 0 && (
        <div style={{ marginBottom: '40px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
          <h3>❤️ Twoje ulubione (Przeciągnij pionowo, aby zmienić kolejność):</h3>
          <Reorder.Group axis='y' values={favorites} onReorder={setFavorites} style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {favorites.map(movie => (
              <Reorder.Item key={movie.id} value={movie} style={{ background: '#fff', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>☰ {movie.title} ({movie.release_date?.slice(0, 4)})</span>
                <button onClick={() => toggleFavorite(movie)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>❌</button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {isError && <div role="alert" style={{ background: '#ffebee', padding: '10px' }}>Błąd: {(error as Error).message}</div>}

      {/* STAGGER LISTA: Wyniki wyszukiwania (Krok C) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '20px',
          opacity: isPlaceholderData ? 0.5 : 1
        }}
      >
        {isLoading 
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.results.map((movie) => (
              <motion.div key={movie.id} variants={itemVariants} className="movie-card">
                {/* Przekazujemy funkcję powiadomień bezpośrednio do karty */}
                <MovieCard movie={movie} /> 
              </motion.div>
            ))
        }
      </motion.div>

      {/* Paginacja */}
      {data && data.total_pages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || isPlaceholderData}>Poprzednia</button>
          <span>Strona {data.page} z {data.total_pages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === data.total_pages || isPlaceholderData}>Następna</button>
        </div>
      )}

      {/* Kontener dla powiadomień animowanych */}
      <ToastContainer toasts={toasts} />
    </section>
  );
}