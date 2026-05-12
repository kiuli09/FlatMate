import "./UserSettings.css";
import { useState } from "react";
import TopBar from "./TopBar";

function UserSettings({ darkMode, setDarkMode }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // For name and email updates
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // for password updates
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name,
      email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Settings saved!");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    alert("Password has been successfully reset!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
  }

  return (
    <div className="settings-page">
      <TopBar user={user} darkMode={darkMode} setDarkMode={setDarkMode} showBackButton={true} />

      <main className="settings-content">
        <section className="settings-card">
          <h2>Account Settings</h2>

          <form onSubmit={handleSave} className="settings-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button className="save-btn" type="submit">
              Save Changes
            </button>
          </form>

          <div className="password-section">
            <button type="button" className="reset-password-btn" onClick={() => setShowPasswordForm(!showPasswordForm)}>
              {showPasswordForm ? "Cancel Password Reset" : "Reset Password"}
            </button>

            {showPasswordForm && (
              <form onSubmit={handleResetPassword} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <button className="save-btn" type="submit">
                  Update Password
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserSettings;