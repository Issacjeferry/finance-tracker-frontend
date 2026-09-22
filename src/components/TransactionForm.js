import React, { useEffect, useState } from "react";
import { createTransaction, updateTransaction } from "../services/transactionService";

const blankForm = { title: "", amount: "", category: "", type: "EXPENSE", date: new Date().toISOString().slice(0, 10), description: "" };

function TransactionForm({ refresh, editData, clearEdit }) {
  const [form, setForm] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(editData);

  useEffect(() => { setForm(editData ? { ...editData, amount: String(editData.amount) } : blankForm); setError(""); }, [editData]);
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Number(form.amount) <= 0) return setError("Amount must be greater than zero.");
    try {
      setSaving(true); setError("");
      const payload = { ...form, amount: Number(form.amount) };
      if (isEdit) await updateTransaction(form.id, payload); else await createTransaction(payload);
      setForm(blankForm); clearEdit(); await refresh();
    } catch (err) { setError("Could not save this transaction. Please check the fields and try again."); }
    finally { setSaving(false); }
  };

  return <section className="form-container" aria-labelledby="form-heading">
    <div className="form-heading"><div><p className="eyebrow">{isEdit ? "UPDATE ENTRY" : "NEW ENTRY"}</p><h2 id="form-heading">{isEdit ? "Edit transaction" : "Add a transaction"}</h2></div>{isEdit && <button type="button" className="text-btn" onClick={() => { clearEdit(); setForm(blankForm); }}>Cancel edit</button>}</div>
    <form onSubmit={handleSubmit}>
      <label>Title<input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Monthly salary" required /></label>
      <label>Amount<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={handleChange} placeholder="0.00" required /></label>
      <label>Category<input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Food" required /></label>
      <label>Type<select name="type" value={form.type} onChange={handleChange}><option value="INCOME">Income</option><option value="EXPENSE">Expense</option></select></label>
      <label>Date<input name="date" type="date" value={form.date} onChange={handleChange} required /></label>
      <label>Description <span className="optional">Optional</span><input name="description" value={form.description || ""} onChange={handleChange} placeholder="Add a note" /></label>
      {error && <div className="form-error" role="alert">{error}</div>}
      <button className="primary-btn" type="submit" disabled={saving}>{saving ? "Saving…" : isEdit ? "Save changes" : "Add transaction"}</button>
    </form>
  </section>;
}
export default TransactionForm;
