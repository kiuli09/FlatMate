import "./Dashboard.css";

function Dashboard({ user }) {
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    const displayName =
        user?.name || user?.username || user?.email?.split("@")[0] || "Flatmate";

    const flatName = currentFlat?.name || "No flat selected";
    const memberCount = currentFlat?.num_people || 0;

    return (
        <>
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
        </>
    );
}

export default Dashboard;