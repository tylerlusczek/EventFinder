export default function AccountInfo({ user, onPasswordChange, authMessage, authMessageType = "error" }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;

    try {
      await onPasswordChange({ currentPassword, newPassword });
      form.currentPassword.value = "";
      form.newPassword.value = "";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="account-card">
      <h2>Account Information</h2>
      <div className="profile-block">
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="password-card">
        <h3>Change Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" name="currentPassword" required placeholder="••••••••" />
          </div>
          <div className="field">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" name="newPassword" required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-login">Update Password</button>
        </form>
        {authMessage && <p className={authMessageType === "success" ? "success-message" : "error-message"}>{authMessage}</p>}
      </div>
    </div>
  );
}
