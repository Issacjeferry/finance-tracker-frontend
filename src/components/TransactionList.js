import React, { useEffect, useMemo, useState } from "react";
import { deleteTransaction, getTransactions } from "../services/transactionService";
import TransactionForm from "./TransactionForm";
import Dashboard from "./Dashboard";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [editData, setEditData] = useState(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      setError("");
      const response = await getTransactions();
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("We couldn’t load your transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const filteredTransactions = useMemo(() => transactions.filter((transaction) => {
    const text = `${transaction.title} ${transaction.category} ${transaction.description || ""}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (typeFilter === "ALL" || transaction.type === typeFilter);
  }), [transactions, query, typeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions((current) => current.filter((transaction) => transaction.id !== id));
      if (editData?.id === id) setEditData(null);
    } catch (err) {
      setError("That transaction could not be deleted. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.assign("/login");
  };

  return (
    <main className="dashboard-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">YOUR MONEY, CLEARLY ORGANIZED</p>
          <h1>Good to see you</h1>
          <p className="page-subtitle">Track your income, spending, and progress in one calm workspace.</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </header>

      <Dashboard transactions={transactions} />
      <TransactionForm refresh={fetchTransactions} editData={editData} clearEdit={() => setEditData(null)} />

      <section className="table-container" aria-labelledby="transactions-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ACTIVITY</p>
            <h2 id="transactions-heading">Transactions <span className="count-pill">{filteredTransactions.length}</span></h2>
          </div>
          <div className="filters" role="search">
            <input aria-label="Search transactions" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search transactions" />
            <select aria-label="Filter transaction type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="ALL">All types</option><option value="INCOME">Income</option><option value="EXPENSE">Expenses</option>
            </select>
          </div>
        </div>

        {error && <div className="alert" role="alert">{error}<button onClick={fetchTransactions}>Retry</button></div>}
        {loading ? <div className="empty-state"><span className="spinner" />Loading your transactions…</div> : filteredTransactions.length === 0 ? (
          <div className="empty-state"><strong>{transactions.length ? "No matching transactions" : "No transactions yet"}</strong><span>{transactions.length ? "Try a different search or filter." : "Add your first transaction above to start seeing your financial picture."}</span></div>
        ) : (
          <div className="table-wrapper"><table><thead><tr><th>Transaction</th><th>Amount</th><th>Category</th><th>Type</th><th>Date</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
            {filteredTransactions.map((transaction) => <tr key={transaction.id}>
              <td><strong>{transaction.title}</strong>{transaction.description && <small>{transaction.description}</small>}</td>
              <td className={transaction.type === "INCOME" ? "amount-income" : "amount-expense"}>{transaction.type === "INCOME" ? "+" : "−"}{money.format(Number(transaction.amount || 0))}</td>
              <td><span className="category-chip">{transaction.category}</span></td><td><span className={`type-badge ${transaction.type.toLowerCase()}`}>{transaction.type.toLowerCase()}</span></td><td>{transaction.date}</td>
              <td className="actions"><button className="action-btn" onClick={() => { setEditData(transaction); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</button><button className="action-btn delete-btn" onClick={() => handleDelete(transaction.id)}>Delete</button></td>
            </tr>)}
          </tbody></table></div>
        )}
      </section>
    </main>
  );
}
export default TransactionList;
