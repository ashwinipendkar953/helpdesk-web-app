import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetState, register } from "../features/user/userSlice";

const INITIAL_FORM_DATA = {
  username: "",
  email: "",
  password: "",
  role: "customer",
};

const RegisterPage = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success(message, { toastId: "success" });
      setFormData(INITIAL_FORM_DATA);
      navigate("/login");
    } else if (isError) {
      toast.error(message, { toastId: "error" });
    }
    dispatch(resetState());
  }, [dispatch, isSuccess, isError, message, navigate, formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="container w-100 my-3 d-flex flex-column justify-content-center align-items-center">
      <div
        className="card w-100 my-3"
        style={{ maxWidth: "576px", borderRadius: "20px" }}
      >
        <div className="card-body">
          <h3 className="text-center fw-bold">Create your account</h3>
          <form className="px-md-5 px-sm-3 py-3" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control py-2"
                placeholder="Enter your name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control py-2"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="d-flex position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-control py-2"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn position-absolute end-0 text-decoration-underline"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Select Role
              </label>
              <select
                id="role"
                name="role"
                className="form-select py-2"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              className="btn btn-dark w-100 fw-semibold py-2 mb-3 text-uppercase"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {isLoading && <p className="text-center">Please wait...</p>}

            <div className="d-flex gap-2 justify-content-center align-items-center">
              <span>Have an Account?</span>
              <Link
                to="/login"
                className="d-block text-center text-black text-uppercase text-decoration-none"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
