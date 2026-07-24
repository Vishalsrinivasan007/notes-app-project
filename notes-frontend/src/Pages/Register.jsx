import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register(){

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/register",{
        name: trimmedName,
        email: trimmedEmail,
        password
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/notes");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return(
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>

        <h1>Create account</h1>
        <p>Start a private notebook in a few seconds.</p>

        {error && <p className="error-message">{error}</p>}

        <label>
          Name
          <input
          type="text"
            value={name}
            placeholder="Your name"
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </label>

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
            placeholder="Choose a password"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </label>

        <button disabled={loading}>{loading ? "Creating..." : "Register"}</button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </form>
    </main>
  )
}

export default Register;

