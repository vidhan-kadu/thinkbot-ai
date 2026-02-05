import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import { useAuth } from "./context/AuthContext";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  // /logout, user ,
  const { token, isAuthenticated } = useAuth();

  const getAllThreads = async () => {
    if (!token) return;
    try {
      const response = await fetch("http://localhost:8080/api/thread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch threads");
        return;
      }
      const res = await response.json();

      if (!Array.isArray(res)) {
        console.error("Threads response is not array", res);
        return;
      }

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      console.log(filteredData);

      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      getAllThreads();
    } else {
      setAllThreads([]); //clear sidebar for guest
    }
  }, [isAuthenticated, currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt(""); // user put data so that's why plane string and object also added
    setReply(null); //backend data and unexpected that why null
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      console.log("Fetching threads with token:", token);

      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      console.log(res);

      //updated threads re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt logo"
          className="logo"
        ></img>
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      {isAuthenticated ? (
        /* LOGGED-IN USER */
        <ul className="history">
          {allThreads.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>
      ) : (
        /* GUEST PREVIEW */
        <div className="history preview">
          <p className="preview-text">🔒 Login to unlock chat history</p>
          <p className="preview-sub">
            Save conversations • Access past chats • Sync across devices
          </p>
        </div>
      )}

      <div className="sign">
        <p>By ThinkBot AI &hearts;</p>
      </div>
    </section>
  );
}
export default Sidebar;
