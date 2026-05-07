import "./Inventory.css";
import { useState, useEffect } from "react";

function Inventory() {
    const [items, setItems] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const currentFlat = JSON.parse(localStorage.getItem("currentFlat"));
    const user = JSON.parse(localStorage.getItem("user"));

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

    const handleDeleteItem = async (itemId) => {

        try {
             const res = await fetch(`${API}/api/inventory/${itemId}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if(!res.ok){
                alert(data.message || "Failed to remove item");
                return;
            }

            setItems(items.filter((item) => item.id !== itemId));
        }catch(err){
            console.error("Error with removing item: ", err);
        }
    };

    const getStatus = (quantity) => {
        return Number(quantity) > 0 ? "In Stock" : "Low Stock";
    };

    const getStatusClass = (quantity) => {
        return Number(quantity) > 0 ? "in-stock" : "low-stock";
    };

    const updateItemQuantity = async (itemId, newQuantity) => {
        try {
            const res = await fetch(`${API}/api/inventory/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: Number(newQuantity) }),
            });

            if (!res.ok) {
                alert("Failed to update item quantity");
                return;
            }

            setItems(items.map((item) =>
                item.id === itemId ? { ...item, quantity: Number(newQuantity) } : item
            ));
        } catch (err) {
            console.error("Error updating item quantity:", err);
        }
    };

    const addToShoppingList = async (item) => {
        try {
            const res = await fetch(`${API}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flat_id: currentFlat.id,
                    name: item.item_name,
                    added_by: user.id,
                }),
            });

            if (!res.ok) {
                alert("Failed to add item to shopping list");
                return;
            }

        } catch (err) {
            console.error("Error adding item to shopping list:", err);
        }
    }

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
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                    <button type="submit">Add</button>
                </form>
            )}

            <div className="items-grid">
                {items.length === 0 ? (
                    <div className="empty-state">
                        No inventory items yet.
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="item-card">
                            <div className="item-card-top">
                                <div className="item-info">
                                    <h3>{item.item_name}</h3>

                                    <div className="quantity-edit">
                                        <label>Quantity:</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItemQuantity(item.id, e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <span className={`item-status ${getStatusClass(item.quantity)}`}>
                                    {getStatus(item.quantity)}
                                </span>
                            </div>

                            <div className="actions">

                                {Number(item.quantity) === 0 && (
                                    <button className="shopping-btn" onClick={() => addToShoppingList(item)}>
                                        Add to Shopping List
                                    </button>
                                )}

                                <button
                                    className="remove-icon-btn"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Inventory;