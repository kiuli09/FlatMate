import "./ShoppingList.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function ShoppingList({ user }) {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    const handleAddItem = () => {
        if (newItem.trim() === "") return;

        const item = {
            id: Date.now(),
            name: newItem
        };

        setItems([...items, item]);
        setNewItem(""); // clear input
    };

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
                    <NavLink to="/finance" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
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
                    <h2>Shopping List</h2>

                    {/* Add item section */}
                    <div className="add-item">
                        <input
                            type="text"
                            placeholder="Enter item..."
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                        />
                        <button onClick={handleAddItem}>Add</button>
                    </div>

                    {/* Display items */}
                    <div className="items-list">
                        {items.length === 0 ? (
                            <p>No items yet</p>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="shopping-item">
                                    {item.name}
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ShoppingList;