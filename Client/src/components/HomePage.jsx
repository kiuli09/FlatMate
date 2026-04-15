import "./HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage({ user, flats }) {
  const navigate = useNavigate();

  const handleSelectFlat = (flat) => {
    localStorage.setItem("currentFlat", JSON.stringify(flat));
    navigate("/dashboard");
  };

  const handleCreateFlat = () => {
    console.log("Create flat clicked");
  };

  const handleJoinFlat = () => {
    console.log("Join flat clicked");
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="app-title">FlatMate</h1>

        <div className="user-section">
          <span className="user-name">{user?.username || "User"}</span>
          <div className="avatar-placeholder"></div>
        </div>
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>Welcome back, {user?.username || "flatmate"}</h2>
          <p>Select a flat to continue or get started below.</p>
        </section>

        <section className="flats-section">
          <h3>Your Flats</h3>

          <div className="flat-grid">
            {flats && flats.length > 0 ? (
              flats.map((flat) => (
                <div
                  key={flat.id}
                  className="flat-card"
                  onClick={() => handleSelectFlat(flat)}
                >
                  <h4>{flat.name}</h4>
                  <p>{flat.members} members</p>
                </div>
              ))
            ) : (
              <p className="no-flats-message">
                You’re not in any flats yet. Create or join one to get started!
              </p>
            )}

            <div className="action-card" onClick={handleCreateFlat}>
              <h4>+ Create Flat</h4>
              <p>Start your own flat group</p>
            </div>

            <div className="action-card" onClick={handleJoinFlat}>
              <h4>+ Join Flat</h4>
              <p>Enter an invite code</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;