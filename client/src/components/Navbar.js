import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  useEffect(() => {
    console.log("Navbar component mounted");
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top bg-light"
      style={{ justifyContent: "flex-end" }}
    >
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Travertin Lux
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <div className="navbar-nav">
            <NavLink
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active fw-bold" : "")
              }
              to="/"
            >
              Acasa
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active fw-bold" : "")
              }
              to="/products"
            >
              Produse
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active fw-bold" : "")
              }
              to="/order"
            >
              Comanda
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active fw-bold" : "")
              }
              to="/contact"
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
