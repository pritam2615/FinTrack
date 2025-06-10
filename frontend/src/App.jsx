import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./pages/TransactionList";
import Summary from "./pages/Summary";
import BudgetView from "./pages/BudgetView";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      {/* <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<TransactionForm />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/all" element={<BudgetView />} />
      </Route> */}

      {/* Protected Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/add"
          element={
            <Layout>
              <TransactionForm />
            </Layout>
          }
        />
        <Route
          path="/transactions"
          element={
            <Layout>
              <TransactionList />
            </Layout>
          }
        />
        <Route
          path="/summary"
          element={
            <Layout>
              <Summary />
            </Layout>
          }
        />
        <Route
          path="/all"
          element={
            <Layout>
              <BudgetView />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
