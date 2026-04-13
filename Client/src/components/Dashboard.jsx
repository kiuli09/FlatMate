import "./Dashboard.css";

function Dashboard({ user }) {
    return (
        <div className="dashboard-page">
            <header className="topbar">
                <div className="topbar-left">
                    <div className="avatar-placeholder"></div>
                    <span className="flat-name">My Flat</span>
                </div>

                <h1 className="app-title">FlatMate</h1>

                <div className="topbar-right">
                    <span className="user-name">{user?.username || "User"}</span>
                    <div className="avatar-placeholder"></div>
                </div>
            </header>

            <div className="dashboard-body">
                <aside className="sidebar">
                    <button className="nav-item active">Finances</button>
                    <button className="nav-item">Shopping List</button>
                    <button className="nav-item">Inventory</button>
                    <button className="nav-item">Timetable</button>
                </aside>

                <main className="main-content">
                    <div className="welcome-section">
                        <h2>Welcome back, {user?.username || "flatmate"}</h2>
                        <p>Here’s an overview of your flat.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;