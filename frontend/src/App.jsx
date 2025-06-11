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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />

        <Route path="/" element={<Layout><Dashboard /></Layout>}/>
        <Route path="/add" element={<Layout><TransactionForm /></Layout>}/>
        <Route path="/transactions" element={<Layout><TransactionList /></Layout>}/>
        <Route path="/summary" element={<Layout><Summary /></Layout>}/>
        <Route path="/all" element={<Layout><BudgetView /></Layout>}/>
      </Routes>
    </Router>
  );
}

export default App;
