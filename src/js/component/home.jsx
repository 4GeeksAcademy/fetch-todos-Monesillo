import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/users/monesillo')
      .then(response => response.json())
      .then(data => {
        if (data.todos && Array.isArray(data.todos)) {
          const formattedTodos = data.todos.map(task => ({
            id: task.id,
            label: task.label,
            done: task.is_done
          }));
          setTodos(formattedTodos);
        }
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    const newTaskObj = {
      label: newTask,
      is_done: false
    };

    fetch('https://playground.4geeks.com/todo/todos/monesillo', {
      method: "POST",
      body: JSON.stringify(newTaskObj),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setTodos(prevTodos => [...prevTodos, { ...newTaskObj, id: data.id }]);
        setNewTask("");
      })
      .catch(error => {
        console.error("Error adding task:", error);
      });
  };

  const handleDeleteTask = (id) => {
    fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al eliminar la tarea");
        }
        setTodos(prevTodos => prevTodos.filter(task => task.id !== id));
      })
      .catch(error => {
        console.error("Error deleting task:", error);
      });
  };

  return (
    <div className="todo-main">
      <h1 className="todo-title">Todos</h1>
      <ul className="todo-list">
        {todos.length > 0 ? (
          todos.map(task => (
            <li key={task.id} className="todo-task">
              {task.label}
              <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>X</button>
            </li>
          ))
        ) : (
          <li className="empty-message">No hay tareas</li>
        )}
      </ul>
      <div className="input-container">
        <input
          type="text"
          className="todo-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
        />
        <button className="add-button" onClick={handleAddTask}>Agregar Tarea</button>
      </div>
    </div>
  );
};

export default TodoList;
