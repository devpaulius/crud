import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}