import { useState, useEffect } from "react";

export default function UserForm({ onSubmit, selectedUser, onCancel, mode = "user" }) {
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
  }, [selectedUser, mode]);

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

  const isAdminMode = mode === "admin" || selectedUser?.isAdmin;
  const showStudentFields = !isAdminMode;

  return (
    <div className="table-card">
      <div className="table-card-header">
        {selectedUser ? (selectedUser.isAdmin ? "Edit Admin" : "Edit User") : mode === "admin" ? "Create Admin" : "Create User"}
      </div>
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
          {showStudentFields ? (
            <div className="field">
              <label htmlFor="grad_year">Grad Year</label>
              <input id="grad_year" name="grad_year" type="number" value={form.grad_year} onChange={handleChange} required={!selectedUser} />
            </div>
          ) : (
            <div className="field">
              <label htmlFor="password">Password {selectedUser ? "(leave blank to keep current)" : ""}</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required={!selectedUser} />
            </div>
          )}
        </div>
        {showStudentFields ? (
          <div className="field-row">
            <div className="field">
              <label htmlFor="major">Major</label>
              <input id="major" name="major" value={form.major} onChange={handleChange} required={!selectedUser} />
            </div>
            <div className="field">
              <label htmlFor="password">Password {selectedUser ? "(leave blank to keep current)" : ""}</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required={!selectedUser} />
            </div>
          </div>
        ) : null}
        <button type="submit" className="btn-login">
          {selectedUser ? (selectedUser.isAdmin ? "Update Admin" : "Update User") : mode === "admin" ? "Create Admin" : "Create User"}
        </button>
        {selectedUser && <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>}
      </form>
    </div>
  );
}