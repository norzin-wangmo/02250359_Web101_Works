import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Todo List</h1>
        <p className="subtitle">State managed with Zustand</p>
      </header>
      <main>
        <TodoInput />
        <TodoList />
      </main>
    </div>
  );
}

export default App;
