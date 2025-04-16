import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import lightBg from "./assets/background_image.jpg"; // Light mode background
import darkBg from "./assets/image.jpg"; // Dark mode background

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div
      style={{
        backgroundImage: `url(${darkMode ? darkBg : lightBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        padding: "20px", // Add padding
      }}
    >
      <h1>TaskAhead App</h1>
      <TodoList darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default App;

