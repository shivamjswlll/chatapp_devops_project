import React, { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../zustans/useConversation";
import { useSocketContext } from "../context/SocketContext";
import { FaUser } from "react-icons/fa";

function Sidebar({ onSelectUser }) {
  const [inputSearch, setInputSearch] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const { setSelectedConversation } = userConversation();
  const { onlineUser } = useSocketContext();

  const onlineSet = useMemo(() => new Set(onlineUser), [onlineUser]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get("/api/user/currentchatters");
        const data = chatters.data;

        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setChatUser(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    chatUserHandler();
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!inputSearch.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/user/search?search=${inputSearch}`);
      const data = res.data;

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      if (data.length === 0) {
        toast.info("No users matched your search.");
        setSearchUser([]);
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
  };

  const handleClearSearch = () => {
    setSearchUser([]);
    setInputSearch("");
  };

  const handleLogout = async () => {
    const confirmLogout = window.prompt("Type your username to confirm logout:");
    if (confirmLogout !== authUser?.username) {
      toast.info("Logout cancelled");
      return;
    }

    setLoading(true);
    try {
      const logout = await axios.post("/api/auth/logout");
      const data = logout.data;
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      toast.success(data.message);
      localStorage.removeItem("Chatapp");
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const listToRender = searchUser.length > 0 ? searchUser : chatUser;
  const emptyLabel = searchUser.length > 0 ? "No matches found." : "No conversations yet.";

  return (
    <div className="sidebar-panel">
      <header className="sidebar-header">
        <div>
          <p className="sidebar-subtitle">Active workspace</p>
          <h2 className="sidebar-title">Conversations</h2>
        </div>
        <button type="button" className="ghost-icon-button" onClick={handleLogout}>
          <BiLogOut />
          <span>Logout</span>
        </button>
      </header>

      <form onSubmit={handleSubmitForm} className="search-bar">
        <FaSearch />
        <input
          onChange={(e) => setInputSearch(e.target.value)}
          value={inputSearch}
          type="text"
          placeholder="Search teammates..."
        />
        {inputSearch && (
          <button type="button" onClick={handleClearSearch} className="chip-button">
            Clear
          </button>
        )}
      </form>

      <div className="sidebar-section">
        <div className="section-heading">
          <p>{searchUser.length > 0 ? "Search results" : "Recent chats"}</p>
          <span className="section-count">{listToRender.length}</span>
        </div>
        <div className="chat-list scroll-area">
          {loading ? (
            <div className="skeleton-stack">
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          ) : listToRender.length === 0 ? (
            <div className="empty-state">
              <p>{emptyLabel}</p>
            </div>
          ) : (
            listToRender.map((user) => {
              const isActive = selectedUserId === user._id;
              const isOnline = onlineSet.has(user._id);
              return (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => handleUserClick(user)}
                  className={`chat-item ${isActive ? "chat-item--active" : ""}`}
                >
                 <div className="chat-item__avatar">
  <FaUser />
  <span
    className={`presence-dot ${
      isOnline ? "presence-dot--online" : "presence-dot--away"
    }`}
  />
</div>

                  <div className="chat-item__details">
                    <p className="chat-item__name">{user.fullname}</p>
                    <p className="chat-item__preview">
                      {isOnline ? "Online" : `@${user.username}`}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
