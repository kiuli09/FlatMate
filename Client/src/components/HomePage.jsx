import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function HomePage({ user, flats, setFlats }) {
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [flatName, setFlatName] = useState("");
  const [members, setMembers] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const displayName =
    user?.name || user?.username || user?.email?.split("@")[0] || "Flatmate";

  useEffect(() => {
  const fetchFlats = async () => {
    try {
      const res = await fetch(`${API}/api/flats`, {
        headers: {
          user: user.id
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error fetching flats:", data.message);
        return;
      }

      setFlats(data.flats);

    } catch (error) {
      console.error("Error fetching flats:", error);
    }
  };

  if (user) {
    fetchFlats();
  }
}, [user?.id]);

  const handleSelectFlat = (flat) => {
    localStorage.setItem("currentFlat", JSON.stringify(flat));
    navigate("/dashboard");
  };

  const handleCreateFlat = () => {
    setShowCreateForm(true);
    //console.log("Create flat clicked");
  };

  const handleJoinFlat = () => {
    setShowJoinForm(true);
    //console.log("Join flat clicked");
  };

  const handleSubmitCreateFlat = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/create-flat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: flatName,
          members: Number(members),
          created_by: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data.message);
        return;
      }

      localStorage.setItem("currentFlat", JSON.stringify(data.flat));
      setFlatName("");
      setMembers("");
      setShowCreateForm(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating flat:", error);
    }
  };

  const handleSubmitJoinFlat = async (e) => {
    e.preventDefault();
    
    try{
      const res = await fetch(`${API}/api/auth/join-flat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        join_code: joinCode, // Using joinCode state for join code input
        user_id: user.id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Backend error:", data.message);
      return;
    }

    localStorage.setItem("currentFlat", JSON.stringify(data.flat));
    setJoinCode("");
    setShowJoinForm(false);
    navigate("/dashboard");
    } catch (error) {
      console.error("Error joining flat:", error);
    }
  }

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("currentFlat");
    window.location.href = "/signin";
  };
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="app-title">FlatMate</h1>

        <div className="user-section">
          
          <span className="user-name">{displayName}</span>
          
          <button type="button" className="avatar-placeholder" onClick={() => setShowUserMenu(!showUserMenu)}>
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
      </header>

      <main className="home-content">
        <section className="welcome-section">
          <h2>Welcome back, {displayName}</h2>
          <p>Select a flat to continue or get started below.</p>
        </section>

        {showCreateForm && (
          <section className="create-flat-section">
            <h3>Create a New Flat</h3>
            <form className="create-flat-form" onSubmit={handleSubmitCreateFlat}>
              <div className="form-group">
                <label htmlFor="flatName">Flat Name</label>
                <input
                  id="flatName"
                  type="text"
                  value={flatName}
                  onChange={(e) => setFlatName(e.target.value)}
                  placeholder="Enter flat name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="members">Number of Members</label>
                <input
                  id="members"
                  type="number"
                  min="1"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  placeholder="Enter number of members"
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Create Flat
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {showJoinForm && (
          <section className="join-flat-section">
            <h3>Join a Flat</h3>
            <form className="join-flat-form" onSubmit={handleSubmitJoinFlat}>
              <div className="form-group">
                <label htmlFor="joinCode">Join Code</label>
                <input
                  id="joinCode"
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter join code"
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Join Flat
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowJoinForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

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