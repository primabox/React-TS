import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <>
      <h1 className="Header">Todo List</h1>
      <ul className="list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </>
  );
}
