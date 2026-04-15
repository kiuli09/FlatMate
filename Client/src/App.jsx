import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ShoppingList from "./components/shoppinglist";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

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
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
        </Routes>
    );
}

export default App;