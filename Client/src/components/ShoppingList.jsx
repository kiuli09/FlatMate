import "./ShoppingList.css";
import { useState, useEffect } from "react";

function ShoppingList({ user }) {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
        setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
}, [successMessage]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`${API}/items`, {
                    headers: {
                        flat: currentFlat?.id
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Error fetching items:", data.message);
                    return;
                }

                setItems(data.items);

            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        if (user) {
            fetchItems();
        }
    }, [user?.id]);

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
            setSuccessMessage(`${newItem} added to list!`);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const handlePurchased = async (itemId) => {

        if (!currentFlat?.id) {
            console.error("No current flat found.");
            return;
        }

        try {
            const res = await fetch(`${API}/items/purchased/${itemId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: itemId,
                    flat_id: currentFlat.id
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Error purchasing item:", errText);
                return;
            }

            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setSuccessMessage("Item marked as purchased! Added to Inventory!");
        } catch (error) {
            console.error("Error purchasing item:", error);
        }
    };

    const handleCheckItem = async (itemId) => {
        try {
            const res = await fetch(`${API}/items/remove/${itemId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Error deleting item:", errText);
                return;
            }

            setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
            setSuccessMessage("Item removed from list!");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <>
        {successMessage && (
    <div className="success-banner">
        <span>{successMessage}</span>

        <button
            className="success-close"
            onClick={() => setSuccessMessage("")}
        >
            ×
        </button>
    </div>
)}
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleAddItem();
                        }
                    }}
                />
                <button onClick={handleAddItem}>Add</button>
            </div>

            <div className="items-list">
                {items.length === 0 ? (
                    <p>No items yet</p>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="shopping-item">
                            <label className="shopping-item-row">
                                <span>{item.name}</span>
                                <div className="actions">
                                    <button
                                        className="purchased-btn"
                                        onClick={() => handlePurchased(item.id)}> Purchased 
                                    </button>

                                    <button
                                        className="remove-btn"
                                        onClick={() => handleCheckItem(item.id)}> ✕
                                    </button>  
                                </div>
                            </label>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default ShoppingList;