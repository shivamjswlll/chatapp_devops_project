import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuth();

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", userInput);
      const data = res.data;

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      toast.success(data.message);
      localStorage.setItem("Chatapp", JSON.stringify(data));
      setAuthUser(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="auth-card">
        <div className="auth-grid">
          <section className="auth-hero">
            <span className="auth-hero__chip">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Secure Access
            </span>
            <h2 className="auth-title">
              Log back in to keep the conversation flowing
            </h2>
            <p className="text-sm text-white/65">
              Continue where you left off. Stay synced across devices with
              real-time messaging, read states, and seamless online presence.
            </p>
          </section>

          <section>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-xs uppercase tracking-[0.4em] text-white/60"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@company.com"
                  className="glow-input mt-2"
                  required
                  onChange={handleInput}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-xs uppercase tracking-[0.4em] text-white/60"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="glow-input mt-2"
                  required
                  onChange={handleInput}
                />
              </div>

              <button
                type="submit"
                className="primary-btn w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-white/60">
              New to Chatters?{" "}
              <Link
                to="/register"
                className="text-white underline decoration-white/40 decoration-dashed hover:text-indigo-200"
              >
                Create an account
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
