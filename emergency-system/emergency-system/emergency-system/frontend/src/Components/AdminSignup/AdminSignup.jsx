import React, { useContext, useState } from "react";
import axios from "axios";
import "./AdminSignup.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { API_URL } from "../../Config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const formSchema = z
  .object({
    name: z.string().min(3, "Naam kam az kam 3 characters ka ho").max(20),
    email: z.string().email("Sahi email address likhein"),
    phone: z
      .string()
      .min(11, "Phone number kam az kam 11 digits ka ho")
      .max(11, "Phone number zayada sy zayada 11 digits ka ho"),
    address: z.string().min(5, "Address detail se likhein"),
    password: z.string().min(5, "Password kam az kam 5 characters ka ho"),
    confirm: z.string().min(1, "Confirm password zaroori hai"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords match nahi ho rahe",
    path: ["confirm"], // Error confirm field ke niche show hoga
  });

const AdminSignup = () => {

  const { setRole , setAdminIsLogedIn} = useContext(AuthContext);

  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("No file selected.");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        alert("Please select a PDF file");
        setCvFile(null);
        setCvFileName("No file selected.");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        setCvFile(null);
        setCvFileName("No file selected.");
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('password', data.password);
      
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      console.log("Form Data:", data);
      const res = await axios.post(`${API_URL}/api/admin/register`, formData);
      console.log("results of call api", res.data);
      localStorage.setItem('role' , res.data.role)
      localStorage.setItem("adminId", res.data.newAdmin.id);
      setRole(res.data.role)
      setAdminIsLogedIn(true)
      alert("Service Provider Registered!");
      reset();
      setCvFile(null);
      setCvFileName("No file selected.");
      navigate('/')
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="admin-signup-container">
      <form className="admin-signup-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Service Provider SignUp</h2>

        <div className="form-grid">
          <div className="input-box">
            <input {...register("name")} placeholder="Full Name" />
            {errors.name && (
              <span className="error">{errors.name.message}</span>
            )}
          </div>
          <div className="input-box">
            <input {...register("email")} placeholder="Email Address" />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>
          <div className="input-box">
            <input {...register("phone")} placeholder="Phone Number" />
            {errors.phone && (
              <span className="error">{errors.phone.message}</span>
            )}
          </div>
          <div className="input-box">
            <input {...register("address")} placeholder="Address" />
            {errors.address && (
              <span className="error">{errors.address.message}</span>
            )}
          </div>
          <div className="input-box">
            <input type="password" {...register("password")} placeholder="Password" />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>
          <div className="input-box">
            <input type="password" {...register("confirm")} placeholder="Confirm Password" />
            {errors.confirm && (
              <span className="error">{errors.confirm.message}</span>
            )}
          </div>
        </div>

        <div className="cv-upload-section">
          <label className="cv-label">Upload Your CV (PDF)</label>
          <div className="cv-upload-box">
            <input 
              type="file" 
              id="cv-input" 
              accept=".pdf" 
              onChange={handleCvFileChange}
              className="cv-file-input"
            />
            <label htmlFor="cv-input" className="browse-btn">
              Browse...
            </label>
            <span className="file-name">{cvFileName}</span>
          </div>
        </div>

        <button type="submit" className="signup-btn">
          Create Service Provider Account
        </button>

          <div className="signup-footer">
          <p>Already have an account? <span onClick={() => navigate("/admin-login")}>Log in</span></p>
        </div>
      </form>
    </div>
  );
};

export { AdminSignup };
