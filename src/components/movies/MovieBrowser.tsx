import React, { useState } from 'react';
import { useFetchMovies } from '../../hooks/useFetchMovies';
import { useDebounce } from '../../hooks/useDebounce';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';

export function MovieBrowser() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isError, error, isPlaceholderData } = useFetchMovies(page, debouncedQuery);

  return (
    <section aria-labelledby="movie-browser-title">
      <h2 id="movie-browser-title">Przeglądarka Filmów (TMDB API)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="movie-search">Wyszukaj film: </label>
        <input
          id="movie-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1); // Reset strony przy nowym wyszukiwaniu
          }}
          placeholder="Wpisz min. 2 znaki..."
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      {isError && (
        <div role="alert" style={{ background: '#ffebee', padding: '10px' }}>
          Błąd pobierania filmów: {(error as Error).message}
        </div>
      )}

      {!isLoading && data?.results.length === 0 && (
        <p role="status">Nie znaleziono filmów dla zapytania: "{query}"</p>
      )}

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '20px',
          opacity: isPlaceholderData ? 0.5 : 1,
          transition: 'opacity 0.2s'
        }}
      >
        {isLoading 
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        }
      </div>

      {data && data.total_pages > 1 && (
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1 || isPlaceholderData}
          >
            Poprzednia
          </button>
          <span>Strona {data.page} z {data.total_pages}</span>
          <button 
            onClick={() => setPage(p => p + 1)} 
            disabled={page === data.total_pages || isPlaceholderData}
          >
            Następna
          </button>
        </div>
      )}
    </section>
  );
}