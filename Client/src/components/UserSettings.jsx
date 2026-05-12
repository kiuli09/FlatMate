import "./UserSettings.css";
import { useState } from "react";
import TopBar from "./TopBar";

function UserSettings({ darkMode, setDarkMode }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // For name  updates
  const [name, setName] = useState(user?.name || "");
  const [showNameForm, setShowNameForm] = useState(false);

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
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setShowNameForm(false);
    alert("Display Name Updated Successfully!");

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
        <section className="settings-heading">
          <h2>Account Settings</h2>
          <p>Manage your account here!</p>
        </section>

        <div className="settings-grid">
          <section className="settings-card">
            <h3>Profile Information</h3>
            <p>Update your display name.</p>

            {!showNameForm && (
              <>
                <div className="display-name-box">
                  {name || "You haven't set a display name yet"}
                </div>

                <button
                  type="button"
                  className="reset-password-btn"
                  onClick={() => setShowNameForm(true)}
                >
                  Update Display Name
                </button>
              </>
            )}

            {showNameForm && (
              <form onSubmit={handleSave} className="settings-form">
                <div className="form-group">
                  <label>Set New Display Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Update your display name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <button className="save-btn" type="submit">
                  Update Name
                </button>

                <button 
                  type="button" 
                  className="reset-password-btn" 
                  onClick={() => setShowNameForm(false)}
                >
                  Cancel Update
                </button>


              </form>
            )}
          </section>

          <section className="settings-card">
            <h3>Email Address</h3>
            <p>Your email address.</p>

            <div className="ro-box">
              {user?.email}
            </div>
          </section>

          <section className="settings-card psw-card">
            <h3>Password</h3>
            <p>Change your account password.</p>

            {!showPasswordForm && (
              <>

                <button
                  type="button"
                  className="reset-password-btn"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Reset Password
                </button>
              </>
            )}

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

                <button
                  type="button"
                  className="reset-password-btn"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel Password Reset
                </button>
              </form>
            )}
          </section>          
        </div>
      </main>
    </div>
  );
}

export default UserSettings;