export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={e => onToggle(todo.id, e.target.checked)}
        />
        {todo.title}
      </label>
      <button
        onClick={() => onDelete(todo.id)}
        className="delete-btn"
      >
        Delete
      </button>
    </li>
  );
}
