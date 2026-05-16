import { useTodoStore } from '../store/todoStore';

export default function TodoItem({ todo }) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const removeTodo = useTodoStore((state) => state.removeTodo);

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span>{todo.text}</span>
      </label>
      <button
        type="button"
        className="remove-btn"
        onClick={() => removeTodo(todo.id)}
        aria-label={`Remove ${todo.text}`}
      >
        ×
      </button>
    </li>
  );
}
