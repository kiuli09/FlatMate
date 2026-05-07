import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ user }) {
    const navigate = useNavigate();
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const [showMembersModal, setShowMembersModal] = useState(false);
    const [membersList, setMembersList] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [shoppingItemCount, setShoppingItemCount] = useState(0);

    const displayName =
        user?.name || user?.username || user?.email?.split("@")[0] || "Flatmate";

    const flatName = currentFlat?.name || "No flat selected";
    const memberCount = currentFlat?.num_people || 0;
    const joinCode = currentFlat?.join_code || "N/A";

    //use effect for fetching shopping items and expenses for flat
    useEffect(() => {
        const fetchFlatData = async () => {
            if (!currentFlat?.id) return;
            try {
                // Fetch shopping items
                const itemsRes = await fetch(`${API}/itemsCount`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        flat_id: currentFlat?.id
                    }
                });
                const itemsData = await itemsRes.json();
                setShoppingItemCount(itemsData.count || 0);
                console.log(itemsData);
            } catch (err) {
                console.error("Error fetching flat data:", err);
            }
        };
        fetchFlatData();
    }, [currentFlat?.id]);

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(joinCode);
            alert("Join code copied!");
        } catch (err) {
            console.error("Failed to copy join code:", err);
        }
    };

    const handleOpenMembers = async () => {
        if (!currentFlat?.id) return;

        setShowMembersModal(true);
        setLoadingMembers(true);

        try {
            const res = await fetch(`${API}/api/flats/${currentFlat.id}/members`);
            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                setMembersList([]);
                return;
            }

            setMembersList(data.members || []);
        } catch (err) {
            console.error("Error fetching members:", err);
            setMembersList([]);
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleCloseMembers = () => {
        setShowMembersModal(false);
    };

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

                <div
                    className="dashboard-card clickable-card"
                    onClick={handleOpenMembers}
                >
                    <h3>Members</h3>
                    <p className="card-value">{memberCount}</p>
                    <p className="card-hint">Click to view members</p>
                </div>

                <div className="dashboard-card">
                    <h3>Join Code</h3>
                    <p className="card-value">{joinCode}</p>
                    <button onClick={handleCopyCode}>Copy Code</button>
                </div>

                <div className="dashboard-card">
                    <h3>Shopping Items</h3>
                    <p className="card-value">{shoppingItemCount}</p>
                </div>

                {/* <div className="dashboard-card">
                    <h3>Outstanding Bills</h3>
                    <p className="card-value">$0</p>
                </div> */}
            </section>

            <section className="content-grid">
                <div className="content-panel">
                    <h3>Recent Activity</h3>
                    <p>No recent activity yet.</p>
                </div>

                <div className="content-panel">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <button onClick={() => navigate("/finances")}>Add Expense</button>
                        <button onClick={() => navigate("/shoppinglist")}>Add Shopping Item</button>
                        <button onClick={() => navigate("/inventory")}>Update Inventory</button>
                        <button onClick={() => navigate("/timetable")}>View Timetable</button>
                    </div>
                </div>

                <div className="content-panel">
                    <h3>Upcoming Bills</h3>
                    <p>No upcoming bills yet.</p>
                </div>
            </section>

            {showMembersModal && (
                <div className="modal-overlay" onClick={handleCloseMembers}>
                    <div
                        className="members-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Flat Members</h3>
                            <button
                                className="close-modal-btn"
                                onClick={handleCloseMembers}
                            >
                                ×
                            </button>
                        </div>

                        {loadingMembers ? (
                            <p>Loading members...</p>
                        ) : membersList.length > 0 ? (
                            <div className="members-list">
                                {membersList.map((member) => (
                                    <div className="member-row" key={member.id}>
                                        <div className="member-avatar">
                                            {member.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="member-info">
                                            <p className="member-name">{member.name}</p>
                                            <p className="member-email">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No members found.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;