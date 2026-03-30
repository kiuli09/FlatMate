import { useEffect, useState } from "react";

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

    return (
        <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
            <h1>FlatMate</h1>
            <p>Your flat management web app is starting up.</p>
            <p><strong>Backend says:</strong> {message}</p>
        </div>
    );
}

export default App;