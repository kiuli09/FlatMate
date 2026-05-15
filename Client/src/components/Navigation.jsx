import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Navigation.css";
import TopBar from "./TopBar";

function Navigation({ user, darkMode, setDarkMode }) {
    const navigate = useNavigate();
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    const displayName =
        user?.name || user?.username || user?.email?.split("@")[0] || "Flatmate";

    const flatName = currentFlat?.name || "My Flat";

    const handleExitFlatGroup = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("currentFlat");
        navigate("/signin");
    };

    return (
        <div className="dashboard-page">
            {/* <header className="topbar">
                <div className="topbar-left">
                    <div className="avatar-placeholder"></div>
                    <div className="topbar-text">
                        <span className="topbar-label">Current Flat</span>
                        <span className="flat-name">{flatName}</span>
                    </div>
                </div>

                <h1 className="app-title">FlatMate</h1>

                <div className="topbar-right">
                    <div className="topbar-text right-align">
                        <span className="topbar-label">Signed in as</span>
                        <span className="user-name">{displayName}</span>
                    </div>
                    <div className="avatar-placeholder"></div>
                </div>
            </header> */}

            <TopBar user={user} darkMode={darkMode} setDarkMode={setDarkMode}/>

            <div className="dashboard-body">
                <aside className="sidebar">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/finances"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Finances
                    </NavLink>

                    <NavLink
                        to="/shoppinglist"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Shopping List
                    </NavLink>

                    <NavLink
                        to="/inventory"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Inventory
                    </NavLink>

                    <NavLink
                        to="/timetable"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Timetable
                    </NavLink>

                    <div className="nav-divider"></div>

                    <NavLink
                        to="/flatsettings"
                        className={
                            ({isActive}) => isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Flat Settings
                    </NavLink>

                    <button 
                        className="nav-item exit-flatgrp-btn" 
                        onClick={handleExitFlatGroup}>
                        Exit Flat Group
                    </button>
                </aside>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Navigation;