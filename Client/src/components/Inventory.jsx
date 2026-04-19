import "./Inventory.css";
import { useState, useEffect } from "react";

function Inventory() {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`${API}/api/inventory/${currentFlat.id}`);
                const data = await res.json();
                setItems(data.items || []);
            } catch (err) {
                console.error("Error fetching inventory:", err);
            }
        };

        if (currentFlat?.id) {
            fetchItems();
        }
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API}/api/inventory`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flat_id: currentFlat.id,
                    item_name: name,
                    quantity: quantity,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setItems([...items, data.item]);
                setShowForm(false);
                setName("");
                setQuantity(1);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    return (
        <div>
            <div className="welcome-section">
                <h2>Inventory</h2>
                <p>Shared flat groceries, ingredients, and household items.</p>
            </div>

            <div className="inventory-header">
                <div></div>
                <button className="add-btn" onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "+ Add Item"}
                </button>
            </div>

            {showForm && (
                <form className="inventory-form" onSubmit={handleAddItem}>
                    <input
                        type="text"
                        placeholder="Item name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                    <button type="submit">Add</button>
                </form>
            )}

            <div className="items-list">
                {items.length === 0 ? (
                    <div className="empty-state">
                        No inventory items yet.
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="item-card">
                            <div className="item-info">
                                <h3>{item.item_name}</h3>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Inventory;