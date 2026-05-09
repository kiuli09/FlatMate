import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import ShoppingList from "./components/ShoppingList";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Inventory from "./components/Inventory";
import HomePage from "./components/HomePage";
import Finance from "./components/Finance";
import Navigation from "./components/Navigation";
import UserSettings from "./components/UserSettings";

function App() {
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user"));
    });
    const [flats, setFlats] = useState([
    { id: 1, name: "Castle Street Flat", members: 5 },
    { id: 2, name: "George Street Flat", members: 4 },
]);

    return (
        <Routes>
            <Route
                path="/signin"
                element={!user ? <SignIn setUser={setUser} /> : <Navigate to="/" replace />}
            />

            <Route
                path="/signup"
                element={!user ? <SignUp setUser={setUser} /> : <Navigate to="/" replace />}
            />

            <Route
                path="/"
                element={
                    user ? <HomePage user={user} flats={flats} setFlats={setFlats} /> : <Navigate to="/signin" replace />
                }
            />

            <Route 
                path="/UserSettings" 
                element={
                    user ? <UserSettings user={user} /> : <Navigate to="/signin" replace />
                }
            />

            <Route
                element={user ? <Navigation user={user} /> : <Navigate to="/signin" replace />}
            >
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/finances" element={<Finance user={user} />} />
                <Route path="/shoppinglist" element={<ShoppingList user={user} />} />
                <Route path="/inventory" element={<Inventory user={user} />} />
            </Route>
        </Routes>
    );
}

export default App;