import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import CreateTicketForm from "./components/CreateTicketForm";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import TicketReplies from "./pages/TicketReplies";

function App() {
  const user = useSelector((state) => state.user.user);
  const isCustomer = user?.role === "customer";
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <Header />
      <Routes>
        {/* Redirect to login if user is not authenticated */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {isAdmin && <Route path="/dashboard" element={<Dashboard />} />}
        {isCustomer && (
          <Route path="/create-ticket" element={<CreateTicketForm />} />
        )}

        {user ? (
          <>
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:id/replies" element={<TicketReplies />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>

      <ToastContainer autoClose={2000} />
    </Router>
  );
}

export default App;
