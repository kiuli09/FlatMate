import "./UserSettings.css";
import { useState } from "react";
import TopBar from "./TopBar";

function UserSettings({ darkMode, setDarkMode }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

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

  return (
    <div className="settings-page">
      <TopBar user={user} darkMode={darkMode} setDarkMode={setDarkMode} showBackButton={true} />

      <main className="settings-content">
        <section className="settings-card">
          <h2>Account Settings</h2>
          <p>Update your account details below.</p>

          <form onSubmit={handleSave} className="settings-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="save-btn" type="submit">
              Save Changes
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default UserSettings;