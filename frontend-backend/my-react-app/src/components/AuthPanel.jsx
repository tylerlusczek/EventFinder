import { useEffect, useState } from "react";

const initialForm = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  grad_year: "",
  major: "",
  currentPassword: "",
  newPassword: "",
};

export default function AuthPanel({ user, onLogin, onSignup, onLogout, onPasswordChange, authMessage }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [mode, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        await onLogin({ email: form.email, password: form.password });
      } else {
        await onSignup({
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          grad_year: Number(form.grad_year),
          major: form.major,
        });
      }
      setForm(initialForm);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await onPasswordChange({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ ...form, currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-card full-screen-auth">
      {!user ? (
        <div>
          <h2>{mode === "login" ? "Login" : "Create Account"}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <>
                <div className="form-group">
                  <label>First Name</label>
                  <input name="first_name" value={form.first_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="last_name" value={form.last_name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Graduation Year</label>
                  <input type="number" name="grad_year" value={form.grad_year} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Major</label>
                  <input name="major" value={form.major} onChange={handleChange} required />
                </div>
              </>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
          </form>

          <button type="button" className="link-button" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Create an account" : "Already have an account?"}</button>
          {authMessage && <p className="info-message">{authMessage}</p>}
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.first_name}</h2>
          <p>Signed in as {user.email}</p>
          <button type="button" onClick={onLogout} className="logout-button">Logout</button>

          <div className="password-card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
              </div>
              <button type="submit">Update Password</button>
            </form>
          </div>
          {authMessage && <p className="info-message">{authMessage}</p>}
        </div>
      )}
    </div>
  );
}
