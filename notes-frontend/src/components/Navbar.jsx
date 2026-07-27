import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Navbar() {
  const [user,setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  },[navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/notes">
        Notes App
      </Link>

      <div className="navbar-actions">
        {user && <span className="user-greeting">Welcome, {user.name}</span>}

        <button className="secondary-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
