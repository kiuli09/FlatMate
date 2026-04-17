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
                    <section className="welcome-banner">
                        <h2>Welcome back, {displayName}</h2>
                        <p>Here’s what’s happening in your flat today.</p>
                    </section>

                    <section className="card-grid">
                        <div className="dashboard-card highlight-card">
                            <h3>Flat Name</h3>
                            <p className="card-value">{flatName}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Members</h3>
                            <p className="card-value">{memberCount}</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Shopping Items</h3>
                            <p className="card-value">0</p>
                        </div>

                        <div className="dashboard-card">
                            <h3>Outstanding Bills</h3>
                            <p className="card-value">$0</p>
                        </div>
                    </section>

                    <section className="content-grid">
                        <div className="content-panel">
                            <h3>Recent Activity</h3>
                            <p>No recent activity yet.</p>
                        </div>

                        <div className="content-panel">
                            <h3>Quick Actions</h3>
                            <div className="quick-actions">
                                <button>Add Expense</button>
                                <button>Add Shopping Item</button>
                                <button>Update Inventory</button>
                                <button>View Timetable</button>
                            </div>
                        </div>

                        <div className="content-panel">
                            <h3>Upcoming Bills</h3>
                            <p>No upcoming bills yet.</p>
                        </div>

                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
