import React, { useState } from "react";
import MessageContainer from "../components/MessageContainer.jsx";
import Sidebar from "../components/Sidebar.jsx";

function Home() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };

  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
  };

  return (
    <div className="home-layout">
      <aside
        className={`home-sidebar glass-panel ${
          isSidebarVisible ? "is-visible" : "is-hidden"
        }`}
      >
        <Sidebar onSelectUser={handleUserSelect} selectedUser={selectedUser} />
      </aside>

      <section
        className={`home-messages message-board glass-panel ${
          selectedUser ? "has-selection" : ""
        }`}
      >
        <MessageContainer
          onBackUser={handleShowSidebar}
          selectedUser={selectedUser}
        />
      </section>
    </div>
  );
}

export default Home;
