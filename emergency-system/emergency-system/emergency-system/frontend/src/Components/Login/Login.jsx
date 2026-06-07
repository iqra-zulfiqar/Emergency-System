import { useContext, useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config";
import { AuthContext } from "../../Context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setRole, setUserIsLogedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Login Data:", { email, password });

    try {
      const res = await axios.post(
        `${API_URL}/api/user/login`,
        { email, password },
        {
          withCredentials: true, // Cookies handle karne ke liye lazmi hai
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.success) {
        console.log("Login Success:", res.data);
        setRole(res.data.user.role);
        setUserIsLogedIn(true);
        localStorage.setItem("role", res.data.user.role);
        // Login ke baad home page ya dashboard par bhej dein
        navigate("/");
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Login fail ho gaya!");
    }
  };

  return (
    <>
      <div className="login-container">
        <h2>User Login</h2>

        {error && (
          <p className="error-msg" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="signup-link">
          Don't have an account?{" "}
          <span onClick={() => navigate("/user-signup")}>SignUp Now</span>
        </p>
      </div>
    </>
  );
}

export { Login };
