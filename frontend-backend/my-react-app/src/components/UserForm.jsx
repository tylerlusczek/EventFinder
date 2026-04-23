import { useState, useEffect } from "react";

export default function UserForm({ onSubmit, selectedUser, onCancel }) {
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    grad_year: "",
    major: "",
    password: "",
  });

  useEffect(() => {
    if (selectedUser) {
      setForm({
        email: selectedUser.email || "",
        first_name: selectedUser.first_name || "",
        last_name: selectedUser.last_name || "",
        grad_year: selectedUser.grad_year || "",
        major: selectedUser.major || "",
        password: "",
      });
    } else {
      setForm({
        email: "",
        first_name: "",
        last_name: "",
        grad_year: "",
        major: "",
        password: "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      email: "",
      first_name: "",
      last_name: "",
      grad_year: "",
      major: "",
      password: "",
    });
  };

  return (
    <div className="table-card">
      <div className="table-card-header">{selectedUser ? "Edit User" : "Create User"}</div>
      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="first_name">First Name</label>
            <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="last_name">Last Name</label>
            <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="grad_year">Grad Year</label>
            <input id="grad_year" name="grad_year" type="number" value={form.grad_year} onChange={handleChange} required />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="major">Major</label>
            <input id="major" name="major" value={form.major} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password {selectedUser ? "(leave blank to keep current)" : ""}</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required={!selectedUser} />
          </div>
        </div>
        <button type="submit" className="btn-login">{selectedUser ? "Update User" : "Create User"}</button>
        {selectedUser && <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>}
      </form>
    </div>
  );
}