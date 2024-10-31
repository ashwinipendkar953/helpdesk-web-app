import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";

const Header = () => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid px-5">
          <Link
            to={isAdmin ? "/dashboard" : "/tickets"}
            className="navbar-brand fs-4 fw-bold"
          >
            Helpdesk
          </Link>

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

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {/* Admin Dashboard Link */}
              {user?.role === "admin" && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
              )}

              {/* User Dropdown for Customer */}
              {user?.role === "customer" && (
                <li
                  className="nav-item dropdown"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <span
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded={isUserMenuOpen}
                  >
                    Tickets
                  </span>
                  {isUserMenuOpen && (
                    <ul className="dropdown-menu bg-dark">
                      <li>
                        <NavLink
                          className="dropdown-item text-light"
                          to="/tickets"
                        >
                          All Tickets
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item text-light"
                          to="/create-ticket"
                        >
                          Create Ticket
                        </NavLink>
                      </li>
                    </ul>
                  )}
                </li>
              )}

              {/* Tickets Dropdown for Agent/Admin */}
              {(user?.role === "admin" || user?.role === "agent") && (
                <li className="px-lg-3">
                  <NavLink className="dropdown-item text-light" to="/tickets">
                    All Tickets
                  </NavLink>
                </li>
              )}

              {user && (
                <li className="username text-dark mx-lg-2 text-capitalize border rounded-circle p-2 fw-semibold fs-5 bg-white ">
                  {user?.username}
                </li>
              )}

              {/* Login / Logout Button */}
              {user ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-lg-3 mt-md-2 mt-sm-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
