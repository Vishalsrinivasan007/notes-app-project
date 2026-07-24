import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login",{
        email: trimmedEmail,
        password
      });

      localStorage.setItem("token",res.data.token);

      navigate("/notes");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return(
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>

        <h1>Welcome back</h1>
        <p>Sign in to keep your notes close.</p>

        {error && <p className="error-message">{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            placeholder="Your password"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </label>

        <button disabled={loading}>{loading ? "Logging in..." : "Login"}</button>

        <p className="auth-link">
          New here? <Link to="/register">Create an account</Link>
        </p>

      </form>
    </main>
  )
}
export default Login;
