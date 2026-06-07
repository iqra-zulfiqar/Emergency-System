import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config";
import "./AdminLogin.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthContext } from "../../Context/AuthContext";

const fromSchema = z.object({
  email: z.string().email("Sahi email address likhein"),
  password: z.string().min(5, "Password kam az kam 5 characters ka ho"),
});

const AdminLogin = () => {
  const navigate = useNavigate();

  const { setAdminIsLogedIn, setRole } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(fromSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, data);

      if (res.data.success) {
        localStorage.setItem("role", res.data.admin.role);
        localStorage.setItem("adminId", String(res.data.admin.id));
        localStorage.setItem("adminIsLoggedIn", "true");
        setRole(res.data.admin.role);
        setAdminIsLogedIn(true);
        console.log('just res data: ' , res.data);
        
        console.log("result of call api", res.data.admin.role);
        reset();
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>Service Provider Login</h2>
          <p>Enter your credentials to access the Service Provider dashboard.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <div className="input-box">
              <label>Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="joe@example.com"
              />
              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>

            <div className="input-box">
              <label>Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </div>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/admin-signup")}>Register Now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export { AdminLogin };
