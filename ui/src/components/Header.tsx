import { Link, NavLink } from "react-router-dom";
import logo from "../logo_small.png";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="" height="40" />
        </Link>
        <div className="navbar-nav">
          <NavLink
            to="/"
            className="btn btn-link nav-link"
            exact
            activeClassName="active">
            Articles
          </NavLink>
          <NavLink
            to="/post"
            className="btn btn-link nav-link"
            activeClassName="active">
            Post Article
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
