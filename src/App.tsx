import React, { useState, useReducer, useMemo } from 'react';
import { Todo, FilterType } from './types/todo';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import { todoReducer, TodoAction } from './reducers/todoReducer';
import { ThemeProvider } from './context/ThemeContext';
import { MovieBrowser } from './components/movies/MovieBrowser';

// 1. IMPORTUJEMY FORMULARZ Z LAB 7
import MultiStepForm from './components/forms/MultiStepForm';

const initialTodos: Todo[] = [
  { id: '1', title: 'Nauczyć się Reacta', completed: false },
  { id: '2', title: 'Praktykować TypeScript', completed: true }
];

export default function App() {
  // Stan filtru
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Stan listy zadań - refaktoryzacja do useReducer
  // Konsola reduxowy styl: używamy dispatch({type, payload})
  const [state, dispatch] = useReducer(todoReducer, { todos: initialTodos });

  // Dodawanie zadania
  const handleAdd = (text: string) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };

  // Przełączanie ukończony/aktywne
  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  // Usuwanie zadania
  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  // Edycja tytułu zadania
  const handleEdit = (id: string, newTitle: string) => {
    dispatch({ type: 'EDIT_TODO', payload: { id, title: newTitle } });
  };

  // Filtrowanie listy zadań na podstawie activeFilter
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
        <header role="banner">
          <Header 
            activeCount={state.todos.filter(t => !t.completed).length} 
            totalCount={state.todos.length} 
          />
        </header>

      <main id="main-content" tabIndex={-1} role="main">
        
      <section aria-labelledby="todo-section-title">
            <h2 id="todo-section-title" className="sr-only">Lista zadań</h2>
            <TodoInput onAdd={handleAdd} />
            <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <TodoList 
              todos={filteredTodos} 
              onToggle={handleToggle} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </section>

        <hr style={{ margin: '60px 0', border: 'none', borderTop: '2px dashed #ccc' }} />

        <section aria-labelledby="form-section-title">
            <h2 id="form-section-title" className="sr-only">Formularz rejestracji</h2>
            <MultiStepForm />
          </section>

        <hr style={{ margin: '60px 0', border: 'none', borderTop: '2px dashed #ccc' }} />

        {/* NOWA SEKCJA LAB 9 */}
        <MovieBrowser />

      </main>

      <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.8rem' }}>
        <p>&copy; 2026 TodoApp - Projekt Lab ZIU</p>
      </footer>
    </div>
  </ThemeProvider>
);
}