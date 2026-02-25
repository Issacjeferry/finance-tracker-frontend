import { BrowserRouter, Routes, Route } from "react-router-dom";
import TransactionList from "./components/TransactionList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import "./style.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function MainLayout() {
  return (
    <div className="app-container">
      <h1>Personal Finance Tracker</h1>
      <TransactionList />
    </div>
  );
}

export default App;