import "./Dashboard.css";
import { NavLink } from "react-router-dom";

function Dashboard({ user }) {
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    return (
        <div className="dashboard-page">
            <header className="topbar">
                <div className="topbar-left">
                    <div className="avatar-placeholder"></div>
                    <span className="flat-name">
                        {currentFlat ? currentFlat.name : "No flat"}
                    </span>
                </div>

                <h1 className="app-title">FlatMate</h1>

                <div className="topbar-right">
                    <span className="user-name">{user?.username || "User"}</span>
                    <div className="avatar-placeholder"></div>
                </div>
            </header>

            <div className="dashboard-body">
                <aside className="sidebar">
                    <NavLink to="/finances" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        Finances
                    </NavLink>
                    <NavLink to="/shoppinglist" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        Shopping List
                    </NavLink>
                    <NavLink to="/inventory" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        Inventory
                    </NavLink>
                    <NavLink to="/timetable" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
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