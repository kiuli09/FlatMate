import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ShoppingList from "./components/shoppinglist";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Inventory from "./components/Inventory";
import HomePage from "./components/HomePage";
import { useState } from "react";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [flats, setFlats] = useState([]);
    return (
        <Routes>
            <Route
                path="/"
                element={user ? <HomePage user={user} flats={flats} setFlats={setFlats} /> : <Navigate to="/signin" replace />}
            />

            <Route
                path="/dashboard"
                element={user ? <Dashboard user={user} /> : <Navigate to="/signin" replace />}
            />

            <Route
                path="/shoppinglist"
                element={user ? <ShoppingList user={user} /> : <Navigate to="/signin" replace />}
            />

            <Route
                path="/inventory"
                element={user ? <Inventory user={user} /> : <Navigate to="/signin" replace />}
            />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;