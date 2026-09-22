import React, { useEffect, useState } from "react";
import { createTransaction, updateTransaction } from "../services/transactionService";
import { useToast } from "./Toast/ToastContext";
import { PlusCircle, Edit3, X, Check, Loader2 } from "lucide-react";

const CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Housing & Rent",
  "Transportation",
  "Utilities & Bills",
  "Entertainment",
  "Healthcare",
  "Salary & Income",
  "Investment",
  "Other",
];

function TransactionForm({ refresh, editData, clearEdit, isOpen, onClose }) {
  const toast = useToast();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food & Dining",
    type: "EXPENSE",
    date: today,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(editData);

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        amount: editData.amount != null ? String(editData.amount) : "",
        date: editData.date ? editData.date : today,
      });
    } else {
      setForm({
        title: "",
        amount: "",
        category: "Food & Dining",
        type: "EXPENSE",
        date: today,
        description: "",
      });
    }
  }, [editData, today]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTypeChange = (newType) => {
    setForm((prev) => ({
      ...prev,
      type: newType,
      category:
        newType === "INCOME"
          ? prev.category === "Food & Dining"
            ? "Salary & Income"
            : prev.category
          : prev.category === "Salary & Income"
          ? "Food & Dining"
          : prev.category,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmount = parseFloat(form.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.warning("Please enter a valid amount greater than 0");
      return;
    }

    if (!form.title.trim()) {
      toast.warning("Please enter a transaction title");
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      title: form.title.trim(),
      amount: numericAmount,
    };

    try {
      if (isEdit) {
        await updateTransaction(form.id, payload);
        toast.success("Transaction updated successfully");
        clearEdit();
      } else {
        await createTransaction(payload);
        toast.success("Transaction added successfully");
      }

      setForm({
        title: "",
        amount: "",
        category: "Food & Dining",
        type: "EXPENSE",
        date: today,
        description: "",
      });

      refresh();
      if (onClose) onClose();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save transaction";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isEdit) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            {isEdit ? <Edit3 size={20} className="text-indigo" /> : <PlusCircle size={20} className="text-indigo" />}
            <h3>{isEdit ? "Edit Transaction" : "New Transaction"}</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => {
              if (isEdit) clearEdit();
              if (onClose) onClose();
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Income vs Expense Toggle */}
          <div className="type-toggle-group">
            <button
              type="button"
              className={`type-btn ${form.type === "EXPENSE" ? "type-btn-active-expense" : ""}`}
              onClick={() => handleTypeChange("EXPENSE")}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-btn ${form.type === "INCOME" ? "type-btn-active-income" : ""}`}
              onClick={() => handleTypeChange("INCOME")}
            >
              Income
            </button>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Title *</label>
              <input
                name="title"
                placeholder="e.g. Grocery shopping, Freelance"
                value={form.title}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-field">
              <label>Amount (₹) *</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Date *</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-field">
            <label>Notes / Description</label>
            <input
              name="description"
              placeholder="Optional additional notes"
              value={form.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (isEdit) clearEdit();
                if (onClose) onClose();
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="btn-spinner">
                  <Loader2 size={16} className="spin" /> Saving...
                </span>
              ) : (
                <span className="btn-content">
                  <Check size={16} /> {isEdit ? "Update Transaction" : "Save Transaction"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;
