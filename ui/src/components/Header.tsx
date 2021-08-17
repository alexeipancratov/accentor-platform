import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Accentor</span>
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
            + Article
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
