import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/notes">
        Notes App
      </Link>
      <button className="secondary-button" type="button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}

export default Navbar;
