import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import Signup from "./pages/Signup.jsx";
import { useAuth } from "./context/AuthContext";
import { v1 as uuidv1 } from "uuid";

function App() {
  const { isAuthenticated } = useAuth();

  const [prompt, setPrompt] = useState("");

  const [reply, setReply] = useState(null);

  const [currThreadId, setCurrThreadId] = useState(uuidv1());

  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads

  const [newChat, setNewChat] = useState(true);

  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };     //passing values

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />

      <Route
        path="/signup"
        element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
      />

      <Route
        path="/"
        element={
          <MyContext.Provider value={providerValues}>
            <div className="app">
              <Sidebar />
              <ChatWindow />
            </div>
          </MyContext.Provider>
        }
      />
    </Routes>
  );
}

export default App;
