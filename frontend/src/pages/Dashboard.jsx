import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTickets } from "../features/ticket/ticketSlice";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { totalTickets, totalCustomers, isLoading } = useSelector(
    (state) => state.ticket
  );

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  console.log(totalTickets, totalCustomers, isLoading);

  return (
    <div className="dashboard container-fluid px-5 py-4">
      <h1>Dashboard</h1>
      {isLoading && <p>Loading data...</p>}
      <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
          <Link to="/tickets" className="text-decoration-none">
            {" "}
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Total Tickets</h5>
                <p className="card-text">{totalTickets}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-4 mb-4">
          <Link to="/tickets" className="text-decoration-none">
            {" "}
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Total Customers</h5>
                <p className="card-text">{totalCustomers}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
