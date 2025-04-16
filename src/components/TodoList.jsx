import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

// 👇 Base URL for your FastAPI backend
const BASE_URL = "https://tdfullstack.onrender.com/api/tasks/";

export default function TodoList({ darkMode, setDarkMode }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    axios.get(BASE_URL)
      .then(response => {
        console.log(response.data); // Debugging
        setTasks(response.data);
      })
      .catch(error => console.error("There was an error fetching tasks:", error));
  }, []);

  const addTask = () => {
    if (task.trim() === "") return;
    axios.post(BASE_URL, { title: task, completed: false })
      .then(response => {
        setTasks([...tasks, response.data]);
        setTask("");
      })
      .catch(error => {
        console.error("Error adding task:", error);
        alert("Failed to add task. Please try again.");
      });
  };

  const removeTask = (index) => {
    const taskToDelete = tasks[index];
    axios.delete(`${BASE_URL}${taskToDelete.id}/`)
      .then(() => {
        setTasks(tasks.filter((_, i) => i !== index));
      })
      .catch(error => console.error("Error removing task:", error));
  };

  const toggleComplete = (index) => {
    const taskToToggle = tasks[index];
    axios.put(`${BASE_URL}${taskToToggle.id}/`, {
      ...taskToToggle,
      completed: !taskToToggle.completed,
    })
      .then(response => {
        setTasks(tasks.map((t, i) => (i === index ? response.data : t)));
      })
      .catch(error => console.error("Error toggling task completion:", error));
  };

  const startEditing = (index, text) => {
    setEditingIndex(index);
    setEditedTask(text);
  };

  const saveEdit = (index) => {
    if (editedTask.trim() === "") return;
    const taskToEdit = tasks[index];
    axios.put(`${BASE_URL}${taskToEdit.id}/`, {
      ...taskToEdit,
      title: editedTask,
    })
      .then(response => {
        setTasks(tasks.map((t, i) => (i === index ? response.data : t)));
        setEditingIndex(null);
      })
      .catch(error => console.error("Error saving task edit:", error));
  };

  const handleDeleteAll = () => {
    if (selectAll) {
      axios.delete(BASE_URL)
        .then(() => {
          setTasks([]);
          setSelectAll(false);
        })
        .catch(error => console.error("Error deleting all tasks:", error));
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    tasks.forEach(task => toggleComplete(tasks.indexOf(task)));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <h2>To-Do List</h2>
      <input
        type="text"
        placeholder="Add a new task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button className="delete-all-button" onClick={handleDeleteAll} disabled={!selectAll}>Delete All</button>
      </div>
      <div className="select-all-container">
        <input 
          type="checkbox" 
          checked={selectAll} 
          onChange={handleSelectAll} 
          id="select-all"
        />
        <label htmlFor="select-all">Select All</label>
      </div>
      <ul>
        {filteredTasks.map((t, index) => (
          <li key={index} className={t.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(index)}
            />
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
                <button onClick={() => saveEdit(index)}>✅</button>
              </>
            ) : (
              <>
                <span>{t.title}</span>
                <button onClick={() => startEditing(index, t.title)}>✏️</button>
                <button onClick={() => removeTask(index)}>❌</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {filteredTasks.length === 0 && <p style={{ textAlign: "center" }}>No tasks available. Add a new task!</p>}
    </div>
  );
}
