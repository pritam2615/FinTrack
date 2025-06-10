import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./pages/TransactionList";
import Summary from "./pages/Summary";
import BudgetView from "./pages/BudgetView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />}/>

        <Route path="/add" element={<TransactionForm />}/>
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/summary" element={<Summary />} />

        <Route path="/all" element={<BudgetView />} />
        {/* <Route path="/set" element={<BudgetView/>} /> */}
      </Routes>
    </Router>  
  );
}

export default App;
