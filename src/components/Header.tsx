import { Link, NavLink } from "react-router-dom";
import logoImg from "../assets/logo.png";

import React from "react";

const Header: React.FC = () => {
  return (
    <div className="container-fluid bg-grey-custom">
      <div className="container">
        <nav className="navbar navbar-expand-lg">
          <Link className="navbar-brand" to="/">
            <img
              src={logoImg}
              alt=""
              style={{ width: "45px", height: "auto" }}
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <NavLink
                  to="/"
                  className={(isActive) =>
                    isActive ? "active nav-link" : "nav-link"
                  }>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/sprints"
                  className={(isActive) =>
                    isActive ? "active nav-link" : "nav-link"
                  }>
                  Sprints
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
