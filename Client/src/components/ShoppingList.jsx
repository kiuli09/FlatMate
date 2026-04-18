import "./ShoppingList.css";
import { useState } from "react";

function ShoppingList({ user }) {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    const handleAddItem = async () => {
        if (!newItem.trim()) return;

        if (!currentFlat?.id) {
            console.error("No current flat found.");
            return;
        }

        try {
            console.log("DEBUG:", { newItem, currentFlat, user });

            const res = await fetch(`${API}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newItem,
                    flat_id: currentFlat.id,
                    added_by: user?.id,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("BACKEND ERROR:", errText);
                return;
            }

            const data = await res.json();
            setItems((prevItems) => [...prevItems, data]);
            setNewItem("");
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    return (
        <>
            <div className="welcome-section">
                <h2>Shopping List</h2>
                <p>Add and keep track of items your flat needs.</p>
            </div>

            <div className="add-item">
                <input
                    type="text"
                    placeholder="Enter item..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                />
                <button onClick={handleAddItem}>Add</button>
            </div>

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
        </>
    );
}

export default ShoppingList;