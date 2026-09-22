import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getTransactions, deleteTransaction } from "../services/transactionService";
import TransactionForm from "./TransactionForm";
import Dashboard from "./Dashboard";
import { useToast } from "./Toast/ToastContext";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  LogOut,
  User as UserIcon,
  AlertTriangle,
  Receipt,
} from "lucide-react";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("DATE_DESC");

  const toast = useToast();

  // Current logged in user info
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTransactions();
      setTransactions(response.data || []);
    } catch (err) {
      console.error("Failed to load transactions", err);
      if (err.response?.status !== 401 && err.response?.status !== 403 && err.response?.status !== 404) {
        toast.error("Failed to load transactions. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const refreshAll = () => {
    fetchTransactions();
    setRefreshFlag((prev) => !prev);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTransaction(deleteTarget.id);
      toast.success(`Deleted "${deleteTarget.title}"`);
      setDeleteTarget(null);
      refreshAll();
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setIsFormOpen(true);
  };

  const clearEdit = () => {
    setEditData(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.setItem("auth_expired_message", "You have been logged out successfully.");
    window.location.href = "/login";
  };

  // Categories list extracted from transactions for dropdown
  const categoriesList = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search filter
        const matchSearch =
          (t.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.description || "").toLowerCase().includes(searchTerm.toLowerCase());

        // Type filter
        const matchType =
          filterType === "ALL" || (t.type || "").toUpperCase() === filterType;

        // Category filter
        const matchCategory =
          selectedCategory === "ALL" || t.category === selectedCategory;

        return matchSearch && matchType && matchCategory;
      })
      .sort((a, b) => {
        if (sortBy === "DATE_DESC") {
          return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "DATE_ASC") {
          return new Date(a.date) - new Date(b.date);
        } else if (sortBy === "AMOUNT_DESC") {
          return Number(b.amount) - Number(a.amount);
        } else if (sortBy === "AMOUNT_ASC") {
          return Number(a.amount) - Number(b.amount);
        }
        return 0;
      });
  }, [transactions, searchTerm, filterType, selectedCategory, sortBy]);

  return (
    <div className="main-content">
      {/* Top Navigation Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-logo-badge">
            <Receipt size={22} />
          </div>
          <div>
            <h1 className="brand-title">FinanceTracker</h1>
            <p className="brand-subtitle">Smart Wealth & Expense Management</p>
          </div>
        </div>

        <div className="header-user-actions">
          <div className="user-profile-chip">
            {user?.pictureUrl ? (
              <img src={user.pictureUrl} alt={user.name || "User"} className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                <UserIcon size={16} />
              </div>
            )}
            <span className="user-name">{user?.name || user?.email || "My Account"}</span>
          </div>

          <button
            className="btn-add-transaction"
            onClick={() => {
              clearEdit();
              setIsFormOpen(true);
            }}
          >
            <Plus size={16} /> Add Transaction
          </button>

          <button className="btn-logout" onClick={handleLogout} title="Sign Out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Dashboard Metrics and Visual Charts */}
      <Dashboard refreshTrigger={refreshFlag} transactions={transactions} />

      {/* Transaction Management Section */}
      <section className="transactions-section">
        <div className="section-header">
          <div className="section-title-wrap">
            <h2>Transactions</h2>
            <span className="count-pill">{filteredTransactions.length} records</span>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="toolbar-wrap">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-pills">
              {["ALL", "EXPENSE", "INCOME"].map((type) => (
                <button
                  key={type}
                  className={`pill-btn ${filterType === type ? "pill-active" : ""}`}
                  onClick={() => setFilterType(type)}
                >
                  {type === "ALL" ? "All" : type === "EXPENSE" ? "Expenses" : "Income"}
                </button>
              ))}
            </div>

            {categoriesList.length > 0 && (
              <div className="select-wrapper">
                <Filter size={14} className="select-icon" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="ALL">All Categories</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="select-wrapper">
              <ArrowUpDown size={14} className="select-icon" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="DATE_DESC">Newest First</option>
                <option value="DATE_ASC">Oldest First</option>
                <option value="AMOUNT_DESC">Highest Amount</option>
                <option value="AMOUNT_ASC">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-card">
          {loading ? (
            <div className="table-loading">
              <div className="shimmer-row" />
              <div className="shimmer-row" />
              <div className="shimmer-row" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="table-empty">
              <Receipt size={40} className="empty-icon" />
              <p>No transactions found</p>
              <span>Try adjusting your search terms or filter selection</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Title & Notes</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th className="th-right">Amount</th>
                    <th className="th-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => {
                    const isIncome = (t.type || "").toUpperCase() === "INCOME";
                    return (
                      <tr key={t.id} className="table-row">
                        <td className="td-primary">
                          <div className="title-text">{t.title}</div>
                          {t.description && (
                            <div className="notes-text">{t.description}</div>
                          )}
                        </td>
                        <td>
                          <span className="category-pill">{t.category || "General"}</span>
                        </td>
                        <td className="td-date">
                          {t.date
                            ? new Date(t.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td>
                          <span className={`type-badge ${isIncome ? "badge-income" : "badge-expense"}`}>
                            {isIncome ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td className={`td-right amount-text ${isIncome ? "text-income" : "text-expense"}`}>
                          {isIncome ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="td-center">
                          <div className="action-buttons-group">
                            <button
                              className="icon-btn btn-edit"
                              onClick={() => handleEdit(t)}
                              title="Edit transaction"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="icon-btn btn-delete"
                              onClick={() => setDeleteTarget(t)}
                              title="Delete transaction"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Add / Edit Transaction Modal */}
      <TransactionForm
        refresh={refreshAll}
        editData={editData}
        clearEdit={clearEdit}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          clearEdit();
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <AlertTriangle size={28} className="text-rose" />
            </div>
            <h3>Delete Transaction?</h3>
            <p>
              Are you sure you want to delete <strong>"{deleteTarget.title}"</strong> (₹
              {Number(deleteTarget.amount).toLocaleString("en-IN")})? This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
