import React, { useEffect, useState } from "react";
import {
  getTransactions,
  deleteTransaction,
} from "../services/transactionService";
import TransactionForm from "./TransactionForm";
import Dashboard from "./Dashboard";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await getTransactions();
    setTransactions(response.data);
  };

  const refreshAll = () => {
    fetchTransactions();
    setRefreshFlag(!refreshFlag);
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    refreshAll();
  };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearEdit = () => {
    setEditData(null);
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
  return (
    <div className="table-container">
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
  <h2 style={{ margin: 0 }}>Dashboard</h2>
  <button className="logout-btn" onClick={handleLogout}>
    Logout
  </button>
</div>
      <Dashboard refreshTrigger={refreshFlag} />

      <TransactionForm
        refresh={refreshAll}
        editData={editData}
        clearEdit={clearEdit}
      />

      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>₹ {t.amount}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>
              <td>{t.date}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(t)}>
  Edit
</button>

<button className="action-btn delete-btn" onClick={() => handleDelete(t.id)}>
  Delete
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
