import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./pages/TransactionList";
import Summary from "./pages/Summary";

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
      </Routes>
    </Router>  
  );
}

export default App;
