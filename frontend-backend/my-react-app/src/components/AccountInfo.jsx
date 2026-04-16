export default function AccountInfo({ user, onPasswordChange, authMessage }) {
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
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Current Password</label>
            <input type="password" name="currentPassword" required />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" required />
          </div>
          <button type="submit">Update Password</button>
        </form>
        {authMessage && <p className="info-message">{authMessage}</p>}
      </div>
    </div>
  );
}
