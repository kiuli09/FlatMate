import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const text = await res.text();
            let data = {};

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                setError("Server returned invalid response");
                setLoading(false);
                return;
            }

            if (!res.ok) {
                setError(data.error || "Signup failed");
                setLoading(false);
                return;
            }

            if (!data.user) {
                setError("Signup failed: no user data returned");
                setLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
            setError("Network/server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Create your FlatMate account</h1>
                <p className="auth-sub">
                    Already have an account? <Link to="/signin">Log in</Link>
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign up"}
                    </button>

                    {error && <div className="error-dialog">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default SignUp;