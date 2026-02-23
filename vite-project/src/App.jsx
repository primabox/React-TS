import { useState } from "react";
import "./style.css";
import NewTodoForm from "./components/NewTodoForm";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState([]);

  function addTodo(title) {
    setTodos(currentTodos => [
      ...currentTodos,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(currentTodos =>
      currentTodos.filter(todo => todo.id !== id)
    );
  }

  return (
    <>
      <NewTodoForm onSubmit={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </>
  );
}