import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="topbar-left">
          <div className="avatar-placeholder"></div>
          <span className="flat-name">Flat Name</span>
        </div>

        <h1 className="app-title">FlatMate</h1>

        <div className="topbar-right">
          <span className="user-name">User Name</span>
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
            <h2>Welcome back</h2>
            <p>Here’s an overview of your flat activity.</p>
          </div>

          <div className="card-grid">
            <div className="dashboard-card">
              <h3>Total Expenses</h3>
              <p className="card-value">$320</p>
            </div>

            <div className="dashboard-card">
              <h3>You Owe</h3>
              <p className="card-value">$45</p>
            </div>

            <div className="dashboard-card">
              <h3>Shopping Items</h3>
              <p className="card-value">8</p>
            </div>

            <div className="dashboard-card">
              <h3>Low Stock Items</h3>
              <p className="card-value">3</p>
            </div>
          </div>

          <div className="content-panel">
            <h3>Recent Activity</h3>
            <p>No recent activity yet.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;