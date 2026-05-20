import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';

// Rejestracja narzędzia WebMCP [cite: 1218]
if ('modelContext' in navigator) {
  // @ts-ignore - Tymczasowe zignorowanie błędu typowania dla eksperymentalnego API
  navigator.modelContext.register({
    name: "search_movies",
    description: "Wyszukuje filmy w zintegrowanej przeglądarce TMDB.",
    parameters: {
      query: { type: "string", description: "Tytuł lub słowa kluczowe filmu" }
    }
  }).catch(console.error);
}

// Konfiguracja globalnego klienta zapytań
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);