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

export default function AuthPanel({ user, onLogin, onSignup, onLogout, onPasswordChange, authMessage, authMessageType = "error" }) {
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
    <div className="login-card">
      {!user ? (
        <>
          <h1 className="login-title">{mode === "login" ? "Log In" : "Create Account"}</h1>
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <div className="field">
                  <label htmlFor="first_name">First Name</label>
                  <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} required placeholder="Jane" />
                </div>
                <div className="field">
                  <label htmlFor="last_name">Last Name</label>
                  <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} required placeholder="Doe" />
                </div>
                <div className="field">
                  <label htmlFor="grad_year">Graduation Year</label>
                  <input id="grad_year" type="number" name="grad_year" value={form.grad_year} onChange={handleChange} required placeholder="2027" />
                </div>
                <div className="field">
                  <label htmlFor="major">Major</label>
                  <input id="major" name="major" value={form.major} onChange={handleChange} required placeholder="Computer Science" />
                </div>
              </>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-login">{mode === "login" ? "Log In" : "Sign Up"}</button>
          </form>

          {authMessage && <p className={authMessageType === "success" ? "success-message" : "error-message"}>{authMessage}</p>}
          <div className="card-footer">
            <button
              type="button"
              className="link-button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create an account" : "Already have an account?"}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="login-title">Welcome, {user.first_name}</h1>
          <p className="login-subtitle">Signed in as {user.email}</p>
          <button type="button" className="btn-login logout-button" onClick={onLogout}>Logout</button>

          <div className="password-card">
            <h3 className="password-card-title">Change Password</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="field">
                <label htmlFor="currentPassword">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" value={form.currentPassword} onChange={handleChange} required placeholder="••••••••" />
              </div>
              <div className="field">
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" name="newPassword" value={form.newPassword} onChange={handleChange} required placeholder="••••••••" />
              </div>
              <button type="submit" className="btn-login">Update Password</button>
            </form>
          </div>
          {authMessage && <p className={authMessageType === "success" ? "success-message" : "error-message"}>{authMessage}</p>}
        </>
      )}
    </div>
  );
}
