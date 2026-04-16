import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ShoppingList from "./components/shoppinglist";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Inventory from "./components/Inventory";
import Finance from "./components/Finance";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Routes>
            <Route
                path="/"
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

            <Route
                path="/finance"
                element={user ? <Finance user={user} /> : <Navigate to="/signin" replace />}
            />

            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;