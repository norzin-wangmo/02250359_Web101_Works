import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';

export default function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const clearCompleted = useTodoStore((state) => state.clearCompleted);

  const completedCount = todos.filter((todo) => todo.completed).length;

  if (todos.length === 0) {
    return <p className="empty-message">No todos yet. Add one above!</p>;
  }

  return (
    <div className="todo-list-wrapper">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      {completedCount > 0 && (
        <button type="button" className="clear-btn" onClick={clearCompleted}>
          Clear completed ({completedCount})
        </button>
      )}
    </div>
  );
}
