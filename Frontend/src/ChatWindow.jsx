import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [isOpen, setisOpen] = useState(false);

  const isDark = document.body.classList.contains("dark");

  const { token, logout, isAuthenticated } = useAuth();
  const { toggleTheme } = useContext(ThemeContext);
  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    console.log("message", prompt, "threadId", currThreadId);
    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      console.log(res.reply);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //Append new chat to prevChats

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setisOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          ThinkBot AI <i className="fa-solid fa-chevron-down"></i>
        </span>
        <button className="themeToggle" onClick={toggleTheme}>
          <i className="fa-solid fa-circle-half-stroke"></i>
        </button>

        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          {!isAuthenticated && (
            <>
              <div
                className="dropDownItem"
                onClick={() => {
                  setisOpen(false);
                  navigate("/login");
                }}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                &nbsp;&nbsp;Login
              </div>

              <div
                className="dropDownItem"
                onClick={() => {
                  setisOpen(false);
                  navigate("/signup");
                }}
              >
                <i className="fa-solid fa-user-plus"></i>&nbsp;&nbsp;Sign up
              </div>
              <div className="dropDownHint">
                🔒 &nbsp;Login to save conversations
              </div>
            </>
          )}

          {isAuthenticated && (
            <>
              <div className="dropDownItem">
                <i className="fa-solid fa-gear"></i>&nbsp;Settings
              </div>

              <div className="dropDownItem">
                <i className="fa-solid fa-cloud-arrow-up"></i>&nbsp;Upgrade plan
              </div>

              <div
                className="dropDownItem"
                onClick={() => {
                  logout();
                  setisOpen(false);
                }}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                &nbsp;Log out
              </div>
            </>
          )}
        </div>
      )}
      <Chat></Chat>

      {loading && (
        <div className="chatLoader">
          <ScaleLoader
            loading={loading}
            color={isDark ? "#ffffff" : "#333333"}
          />
        </div>
      )}

      <div className="chatInput">
        <div className="userBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          ThinkBot AI is evolving — responses may improve over time.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
