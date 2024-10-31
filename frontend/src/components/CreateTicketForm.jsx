import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTicket,
  fetchAllTickets,
  fetchCustomerAllTickets,
  resetState,
} from "../features/ticket/ticketSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateTicketForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.ticket
  );
  const user = useSelector((state) => state.user.user);
  const role = user?.role;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(message, { toastId: "success" });
      setFormData({ title: "", description: "" });
      navigate("/tickets");
    } else if (isError) {
      toast.error(message, { toastId: "error" });
    }
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, isSuccess, isError, message, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createTicket({
        title: formData.title,
        description: formData.description,
        customer: user?._id,
      })
    );
    if (role === "customer") {
      dispatch(fetchCustomerAllTickets(user?._id));
    } else {
      dispatch(fetchAllTickets());
    }
  };

  return (
    <div className="d-flex my-5 justify-content-center align-items-center">
      <div className="card p-4" style={{ maxWidth: "560px", width: "100%" }}>
        <h1 className="text-center mb-4">Create New Ticket</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Ticket Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              placeholder="Enter ticket title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark py-2 w-100"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Ticket"}
          </button>

          {isError && <p className="text-danger mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateTicketForm;
