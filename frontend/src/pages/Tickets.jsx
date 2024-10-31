import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAllTickets,
  fetchCustomerAllTickets,
  updateTicketStatus,
} from "../features/ticket/ticketSlice";

const Tickets = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading } = useSelector((state) => state.ticket);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const role = user?.role;
  const isCustomer = role === "customer";

  useEffect(() => {
    if (role === "customer") {
      dispatch(fetchCustomerAllTickets(user?._id));
    } else {
      dispatch(fetchAllTickets());
    }
  }, [dispatch, user, role]);

  const handleStatusChange = (ticketId, newStatus) => {
    dispatch(updateTicketStatus({ ticketId, status: newStatus }));
  };

  const handleTicketLink = (event, ticketId) => {
    event.preventDefault();
    navigate(`/tickets/${ticketId}/replies`);
  };

  return (
    <div className="tickets container-fluid px-5 py-4">
      <h1>Tickets</h1>
      {isLoading && <p>Loading tickets...</p>}
      {tickets?.length === 0 && <div>No tickets are here.</div>}

      {tickets?.length > 0 && (
        <div className="d-none d-lg-block responsive-table">
          {/* Table view for larger screens */}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                {!isCustomer && <th>Customer Name</th>}
                <th>Last Updated</th>
                {isCustomer && <th>Status</th>}
                {!isCustomer && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tickets?.map((ticket) => {
                const customer = ticket?.customer;
                const lastUpdated = new Date(
                  ticket?.updatedAt
                ).toLocaleDateString();
                return (
                  <tr key={ticket?._id}>
                    <td>
                      <Link
                        className="text-decoration-none"
                        onClick={(event) =>
                          handleTicketLink(event, ticket?._id)
                        }
                      >
                        {ticket?._id}
                      </Link>
                    </td>
                    <td>{ticket?.title}</td>
                    {!isCustomer && (
                      <td className="text-capitalize">{customer?.username}</td>
                    )}
                    <td>{lastUpdated}</td>
                    {isCustomer && (
                      <td className="text-capitalize">{ticket?.status}</td>
                    )}
                    {!isCustomer && (
                      <td>
                        <select
                          className={`form-select ps-3 fw-semibold form-select-sm rounded-pill ${
                            ticket.status === "active"
                              ? "bg-success text-white"
                              : ticket.status === "pending"
                              ? "bg-warning text-dark"
                              : ticket.status === "closed"
                              ? "bg-danger text-white"
                              : "bg-dark text-white"
                          }`}
                          value={ticket?.status}
                          onChange={(e) =>
                            handleStatusChange(ticket?._id, e?.target.value)
                          }
                        >
                          <option value="active" className="bg-white text-dark">
                            Active
                          </option>
                          <option
                            value="pending"
                            className="bg-white text-dark"
                          >
                            Pending
                          </option>
                          <option value="closed" className="bg-white text-dark">
                            Closed
                          </option>
                        </select>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Card view for medium and small screens */}
      <div className="d-lg-none">
        <div className="row">
          {tickets?.map((ticket) => {
            const customer = ticket.customer;
            const lastUpdated = new Date(ticket.updatedAt).toLocaleDateString();
            return (
              <div key={ticket._id} className="col-md-4 col-sm-6 col-12 mb-3">
                <div className="card h-100 d-flex flex-column">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{ticket.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      <span className="fw-bold">Ticket ID:</span>{" "}
                      <Link
                        className="text-decoration-none"
                        onClick={(event) =>
                          handleTicketLink(event, ticket?._id)
                        }
                      >
                        {ticket?._id}
                      </Link>
                    </h6>
                    {!isCustomer && (
                      <p className="card-text text-capitalize">
                        <span className="fw-semibold">Customer:</span>{" "}
                        {customer?.username}
                      </p>
                    )}
                    <p className="card-text">
                      <span className="fw-semibold">Last Updated:</span>{" "}
                      {lastUpdated}
                    </p>
                    {isCustomer && (
                      <p className=" mt-auto card-text text-capitalize">
                        <span className="fw-semibold">Status:</span>{" "}
                        {ticket?.status}
                      </p>
                    )}
                    {!isCustomer && (
                      <div className="mt-auto">
                        <select
                          className={`form-select  mt-2 ps-3 fw-semibold form-select-sm rounded-pill ${
                            ticket.status === "active"
                              ? "bg-success text-white"
                              : ticket.status === "pending"
                              ? "bg-warning text-dark"
                              : ticket.status === "closed"
                              ? "bg-danger text-white"
                              : "bg-dark text-white"
                          }`}
                          value={ticket?.status}
                          onChange={(e) =>
                            handleStatusChange(ticket._id, e.target.value)
                          }
                        >
                          <option value="active" className="bg-white text-dark">
                            Active
                          </option>
                          <option
                            value="pending"
                            className="bg-white text-dark"
                          >
                            Pending
                          </option>
                          <option value="closed" className="bg-white text-dark">
                            Closed
                          </option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
