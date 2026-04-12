import { useEffect, useState } from "react";
import DashboardLayout from "./components/Dashboard";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/test")
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => {
                console.error("Error fetching backend:", error);
                setMessage("Could not connect to backend");
            });
    }, []);

    return <DashboardLayout message={message} />;
}

export default App;