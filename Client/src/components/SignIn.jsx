import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function SignIn({ setUser }) {
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

        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const text = await res.text();
            let data = {};

            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                setError(`Login failed (${res.status})`);
                setLoading(false);
                return;
            }

            if (!res.ok) {
                setError(data.error || data.message || `Login failed (${res.status})`);
                setLoading(false);
                return;
            }

            if (!data.user) {
                setError("Sign in failed: no user data returned");
                setLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            localStorage.setItem("loginSuccess","Signed in successfully");
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
                <h1 className="auth-title">Log in to FlatMate</h1>
                <p className="auth-sub">
                    Don’t have an account? <Link to="/signup">Sign up</Link>
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
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
                        {loading ? "Signing in..." : "Log in"}
                    </button>

                    {error && <div className="error-dialog">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default SignIn;