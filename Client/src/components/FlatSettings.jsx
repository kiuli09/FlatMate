import "./FlatSettings.css";
import { useEffect, useState } from "react";

function FlatSettings() {

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

  const [flat, setFlat] = useState(null);
  const [members, setMembers] = useState([]);
  const [newFlatName, setNewFlatName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFlatDetails();
    fetchMembers();
  }, []);

  const fetchFlatDetails = async () => {
    try {
      const res = await fetch(`${API}/api/flats/${currentFlat.id}/details`);
      const data = await res.json();

      if (!res.ok) {
        setMessage("Failed to fetch flat details.");
        return;
      }
      setFlat(data.flat);
      setNewFlatName(data.flat.name);
      setMessage("");
    } catch (error) {
      console.error("Error fetching flat details:", error);
      setMessage("Failed to fetch flat details.");
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API}/api/flats/${currentFlat.id}/members`);
      const data = await res.json();

      setMembers(data.members || []);
      setMessage("");

    } catch (error) {
      console.error("Error fetching flat members:", error);
      setMessage("Failed to fetch flat members.");
    }
  };

  const handleUpdateFlatName = async () => {

    try {

      const res = await fetch(`${API}/api/flats/${currentFlat.id}/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newFlatName })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Failed to update flat name.");
        return;
      }

      const updatedFlat = { ...currentFlat, name: data.flat.name };

      localStorage.setItem("currentFlat", JSON.stringify(updatedFlat));

      setFlat(data.flat);
      setMessage("Flat name updated successfully.");

    } catch (error) {
      console.error("Error updating flat name:", error);
      setMessage("Failed to update flat name.");
    }
  }

  return (
    <div className="flat-settings-page">
      <div className="flat-settings-header">
        <h2>Flat Settings</h2>
        <p>Manage your flat details and members!</p>
      </div>

      {/* {message && (
        <p className="message">{message}</p>
      )} */}

      <section className="settings-card">
        <h3>Flat Details</h3>
        <p><strong>Flat Name:</strong> {flat?.name}</p>
        <p><strong>Join Code:</strong> {flat?.join_code}</p>
        <p><strong>Members:</strong> {members.length} / {flat?.num_people}</p>      
      </section>

      <section className="settings-card">
        <h3>Change Flat Name</h3>
        <input
          type="text"
          value={newFlatName}
          onChange={(e) => setNewFlatName(e.target.value)}
          placeholder="Enter new flat name"
        />
        <button onClick={handleUpdateFlatName}>Update Name</button>
      </section>

      <section className="settings-card">
        <h3>Flat Members</h3>

        {members.map((m) => (
          <div className="members-list" key={m.id}>
            <span>{m.email}</span>
            <button className="remove-btn">Remove</button>
          </div>
        ))}
      </section>

      <section className="settings-card">
        <h3>Add Member</h3>
        <input
          type="email"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          placeholder="Enter member's email"
        />
        <button>Add Member</button>
      </section>

      {/* <h2>Flat Settings</h2>
      <p>Here you can manage your flat settings, such as inviting new members, changing flat details, and more.</p> */}
    </div>
  );
}

export default FlatSettings;