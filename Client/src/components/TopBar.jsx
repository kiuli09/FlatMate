import "./TopBar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TopBar({ user, darkMode, setDarkMode }) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    const displayName =
        user?.name || user?.username || user?.email?.split("@")[0] || "Flatmate";

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("currentFlat");
        navigate("/signin");
    };

    return (
        <header className="topbar">
            <h1 className="topbar-logo">FlatMate</h1>

            <div className="topbar-right">
                <button
                    type="button"
                    className="dark-mode-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                >
                    {darkMode ? "🌞" : "🌙"}
                </button>

                <div className="profile-wrapper">
                    <button
                        type="button"
                        className="profile-circle"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </button>

                    {showUserMenu && (
                        <div className="user-menu">
                            <button onClick={() => navigate("/UserSettings")}>
                                Settings
                            </button>

                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default TopBar;