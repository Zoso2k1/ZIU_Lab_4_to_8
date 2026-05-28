import React, { useState, useReducer, useMemo } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo, FilterType } from './types/todo';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import { todoReducer } from './reducers/todoReducer';
import { ThemeProvider } from './context/ThemeContext';
import MultiStepForm from './components/forms/MultiStepForm';
import { MovieBrowser } from './components/movies/MovieBrowser';

const initialTodos: Todo[] = [
  { id: '1', title: 'Nauczyć się Reacta', completed: false },
  { id: '2', title: 'Praktykować TypeScript', completed: true }
];

// Definicja wariantów dla przejść stron (Etap B)
const pageVariants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 16,  transition: { duration: 0.18, ease: 'easeIn' } },
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [state, dispatch] = useReducer(todoReducer, { todos: initialTodos });
  const location = useLocation(); // Pobranie ścieżki dla AnimatePresence

  const handleAdd = (text: string) => dispatch({ type: 'ADD_TODO', payload: text });
  const handleToggle = (id: string) => dispatch({ type: 'TOGGLE_TODO', payload: id });
  const handleDelete = (id: string) => dispatch({ type: 'DELETE_TODO', payload: id });
  const handleEdit = (id: string, newTitle: string) => dispatch({ type: 'EDIT_TODO', payload: { id, title: newTitle } });

  const filteredTodos = useMemo(() => {
    return state.todos.filter(todo => {
      if (activeFilter === 'active') return !todo.completed;
      if (activeFilter === 'completed') return todo.completed;
      return true;
    });
  }, [state.todos, activeFilter]);

  return (
    <ThemeProvider>
      <a href="#main-content" className="skip-link">Skocz do treści głównej</a>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Nawigacja z labu */}
        <nav role="navigation" style={{ display: 'flex', gap: '20px', marginBottom: '30px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0043FF' }}>📋 Dashboard & Formularz</Link>
          <Link to="/movies" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#0043FF' }}>🎬 Przeglądarka Filmów</Link>
        </nav>

        <main id="main-content" tabIndex={-1} role="main">
          {/* IMPLEMENTACJA ANMATEPRESENCE DLA TRAS (Etap B) */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              
              {/* Główny Dashboard */}
              <Route path="/" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <header role="banner">
                    <Header activeCount={state.todos.filter(t => !t.completed).length} totalCount={state.todos.length} />
                  </header>
                  <section aria-labelledby="todo-section-title">
                    <h2 id="todo-section-title" className="sr-only">Lista zadań</h2>
                    <TodoInput onAdd={handleAdd} />
                    <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                    <TodoList todos={filteredTodos} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleEdit} />
                  </section>
                  <hr style={{ margin: '40px 0', border: 'none', borderTop: '2px dashed #ccc' }} />
                  <section aria-labelledby="form-section-title">
                    <h2 id="form-section-title" className="sr-only">Formularz rejestracji</h2>
                    <MultiStepForm />
                  </section>
                </motion.div>
              } />

              {/* Podstrona Filmów */}
              <Route path="/movies" element={
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <MovieBrowser />
                </motion.div>
              } />

            </Routes>
          </AnimatePresence>
        </main>

        <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.8rem' }}>
          <p>&copy; 2026 TodoApp - Projekt Lab ZIU</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}