import React from "react";
import "./App.css";
import Login from "./login/Login";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Register from "./register/Register";
import Home from "./home/Home";
import { VerifyUser } from "./utils/VerifyUser";

function App() {
  return (
    <div className="app-shell">
      <div className="floating-gradient floating-gradient--one" />
      <div className="floating-gradient floating-gradient--two" />

      <main className="app-card">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<VerifyUser />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </main>

      <ToastContainer theme="dark" position="bottom-right" autoClose={2800} />
    </div>
  );
}

export default App;
