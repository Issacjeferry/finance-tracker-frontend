import React, { useEffect, useState } from "react";
import { createTransaction, updateTransaction } from "../services/transactionService";

function TransactionForm({ refresh, editData, clearEdit }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "INCOME",
    date: "",
    description: ""
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm(editData);
      setIsEdit(true);
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: parseFloat(form.amount)
    };

    if (isEdit) {
      await updateTransaction(form.id, payload);
      setIsEdit(false);
      clearEdit();
    } else {
      await createTransaction(payload);
    }

    setForm({
      title: "",
      amount: "",
      category: "",
      type: "INCOME",
      date: "",
      description: ""
    });

    refresh();
  };

  return (
  <div className="form-container">
    <h2>{isEdit ? "Edit Transaction" : "Add Transaction"}</h2>
    <form onSubmit={handleSubmit}>

        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <input name="date" type="date" value={form.date} onChange={handleChange} required />

        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <button type="submit">
          {isEdit ? "Update" : "Add"}
        </button>

        {isEdit && (
          <button type="button" onClick={() => {
            clearEdit();
            setIsEdit(false);
            setForm({
              title: "",
              amount: "",
              category: "",
              type: "INCOME",
              date: "",
              description: ""
            });
          }}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default TransactionForm;
