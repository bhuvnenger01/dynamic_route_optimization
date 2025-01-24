import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export const Navigation = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-card">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-600">
          <img src="./images/logo3.png" width="110px" height="auto" ></img>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>
        </nav>
        <button className="md:hidden text-white">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};