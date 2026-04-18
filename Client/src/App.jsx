import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ShoppingList from "./components/ShoppingList";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Inventory from "./components/Inventory";
import HomePage from "./components/HomePage";
import Finance from "./components/Finance";
import Navigation from "./components/Navigation";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));


    return (
        <Routes>
            <Route
                path="/signin"
                element={!user ? <SignIn /> : <Navigate to="/" replace />}
            />

            <Route
                path="/signup"
                element={!user ? <SignUp /> : <Navigate to="/" replace />}
            />

            <Route
                path="/"
                element={
                    user ? <HomePage user={user} flats={flats} /> : <Navigate to="/signin" replace />
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