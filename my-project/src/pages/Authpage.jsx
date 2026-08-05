import React, { useState } from "react";
import axios from "axios";
import { Link, Outlet, useNavigate } from "react-router-dom";
import LoginLeft from "../components/LoginLeft";

const Authpage = ({ mode }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isLogin = mode === "login";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const { data } = await axios.post(
          "  https://backend-five-eta-71.vercel.app/api/auth/login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        console.log(data);

        if (data.message === "Login Successful") {
          navigate("/builder"); 
        }
      } else {
  
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const { data } = await axios.post(
          " https://backend-five-eta-71.vercel.app/api/auth/register",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }
        );

        console.log(data);

        if (data.message === "Registration Successful") {
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <LoginLeft />

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="mb-10">
              <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-1.5">
                {isLogin ? "Sign In" : "Create an account"}
              </h1>

              <p className="text-zinc-600">
                {isLogin
                  ? "Enter your credentials."
                  : "Create your account."}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-4 py-3"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-4 py-3"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black py-3 text-white font-medium hover:bg-zinc-800"
              >
                {loading
                  ? "Loading..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm">
              {isLogin ? (
                <>
                  New user?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-black hover:underline"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="font-medium text-black hover:underline"
                  >
                    Login
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Authpage;