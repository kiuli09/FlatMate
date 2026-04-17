import "./Dashboard.css";
import { NavLink } from "react-router-dom";

function Dashboard({ user }) {
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    const displayName =
        user?.name || user?.username || user?.email?.split("@")[0] || "Flatmate";

    const flatName = currentFlat?.name || "No flat selected";
    const memberCount = currentFlat?.num_people || 0;

    return (
        <div className="dashboard-page">
            <header className="topbar">
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
            </header>

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
                </aside>

                <main className="main-content">
                    <div className="welcome-section">
                        <h2>Welcome back, {user?.username || "flatmate"}</h2>
                        <p>Here’s an overview of your flat.</p>
                        <div>
                            {currentFlat && (
                                <p>
                                    <strong>Flat Name:</strong> {currentFlat.name}
                                </p>
                            )}

                            <p>
                                <strong>Members:</strong> {currentFlat ? currentFlat.num_people : "None"}
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;