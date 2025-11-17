import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});
  const { setAuthUser } = useAuth();

  const handleInput = (e) => {
    setInputData({ ...inputData, [e.target.id]: e.target.value });
  };

  const selectGender = (gender) => {
    setInputData((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputData.password !== inputData.confpassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", inputData);
      const data = res.data;

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      toast.success("Welcome aboard! Account created.");
      localStorage.setItem("Chatapp", JSON.stringify(data));
      setAuthUser(data);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unable to register");
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
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              Create Account
            </span>
            <h2 className="auth-title">
              Own every conversation with a personalized inbox
            </h2>
            <p className="text-sm text-white/65">
              Build your identity, pick an avatar, and sync chats across every
              device in seconds.
            </p>
          </section>

          <section>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullname"
                  className="text-xs uppercase tracking-[0.4em] text-white/60"
                >
                  Full name
                </label>
                <input
                  type="text"
                  id="fullname"
                  placeholder="Jordan Carter"
                  className="glow-input mt-2"
                  required
                  onChange={handleInput}
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="text-xs uppercase tracking-[0.4em] text-white/60"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="jcarter"
                  className="glow-input mt-2"
                  required
                  onChange={handleInput}
                />
              </div>
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
              <div className="grid gap-4 md:grid-cols-2">
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
                <div>
                  <label
                    htmlFor="confpassword"
                    className="text-xs uppercase tracking-[0.4em] text-white/60"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confpassword"
                    placeholder="••••••••"
                    className="glow-input mt-2"
                    required
                    onChange={handleInput}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Select avatar type
                </p>
                <div className="mt-3 flex gap-3">
                  {["male", "female"].map((gender) => (
                    <button
                      type="button"
                      key={gender}
                      onClick={() => selectGender(gender)}
                      className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] ${
                        inputData.gender === gender
                          ? "border-sky-400 bg-sky-400/20 text-white"
                          : "border-white/10 bg-white/5 text-white/70"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="primary-btn w-full"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white underline decoration-white/40 decoration-dashed hover:text-indigo-200"
              >
                Sign in
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Register;
