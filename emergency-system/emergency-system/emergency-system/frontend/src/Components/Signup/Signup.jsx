import { useContext, useState } from "react";
import "./Signup.css";
import axios from "axios";
import {useNavigate } from 'react-router-dom'
import { API_URL } from "../../Config";
import { AuthContext } from "../../Context/AuthContext";

function Signup() {

  const {setRole , setUserIsLogedIn} = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cv: null, // file
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cv") {
      setFormData({ ...formData, cv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!formData.cv) {
      setError("Please upload your CV");
      return;
    }

    setError("");
    console.log("Signup Data:", formData);

    try {
      const res = await axios.post(
        `${API_URL}/api/user/register-service-provider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if(res.data.success){
        console.log("Success:", res.data);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          cv: null,
        });
        setRole(res.data.user.role);
        localStorage.setItem('role' , res.data.user.role);
        setUserIsLogedIn(true);
        alert("Registration Successful!");
        navigate('/')
      }

    } catch (error) {
      console.error(
        "Error:",
        error.response?.data?.message || "Something went wrong",
      );
    }

    // alert("Signup form submitted (demo, no API)");
  };

  return (
    <>
      <div className="signup-container">
        <h2>Service Provider Signup</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* CV Upload */}
          <label htmlFor="cv">Upload Your CV (PDF)</label>
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
          />

          <button type="submit">Signup</button>
        </form>
      </div>
    </>
  );
}

export { Signup };
