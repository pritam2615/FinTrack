import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./pages/TransactionList";
import Summary from "./pages/Summary";
import BudgetView from "./pages/BudgetView";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><Layout><TransactionForm /></Layout></PrivateRoute>} />
        <Route path="/transactions" element={<PrivateRoute><Layout><TransactionList /></Layout></PrivateRoute>} />
        <Route path="/summary" element={<PrivateRoute><Layout><Summary /></Layout></PrivateRoute>} />
        <Route path="/all" element={<PrivateRoute><Layout><BudgetView /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
