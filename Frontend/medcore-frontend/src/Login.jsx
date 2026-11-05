import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {

    const [isRegister, setIsRegister] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:7777/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // Store JWT token in browser
                localStorage.setItem("medcoreToken", data.token);

                // Store admin email
                localStorage.setItem("medcoreEmail", email);

                onLogin(email);

            } else {
                setError(data.message || "Invalid email or password");
            }

        } catch (err) {
            setError("Unable to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:7777/api/admin/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess("Registration successful! Please login.");

                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    setIsRegister(false);
                    setSuccess("");
                }, 1500);

            } else {
                setError(data.message || "Registration failed.");
            }

        } catch (err) {
            setError("Unable to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">✚</div>

                <h1>MEDCORE</h1>

                <p className="login-subtitle">
                    Hospital Management System
                </p>

                <h2>
                    {isRegister ? "Admin Registration" : "Admin Login"}
                </h2>

                <p className="login-description">
                    {isRegister
                        ? "Create your administrator account."
                        : "Welcome back! Please sign in to continue."}
                </p>

                <form onSubmit={isRegister ? handleRegister : handleLogin}>

                    {isRegister && (
                        <div className="login-input-group">
                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="login-input-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-input-group">
                        <label>Password</label>

                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="show-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {isRegister && (
                        <div className="login-input-group">
                            <label>Confirm Password</label>

                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <p className="login-error">{error}</p>
                    )}

                    {success && (
                        <p style={{ color: "green", textAlign: "center" }}>
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isRegister
                                ? "Create Account"
                                : "Sign In"}
                    </button>

                </form>

                <p style={{ textAlign: "center", marginTop: "18px" }}>
                    {isRegister
                        ? "Already have an account? "
                        : "Don't have an account? "}

                    <button
                        type="button"
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError("");
                            setSuccess("");
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#2477d4",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        {isRegister ? "Login Here" : "Register Here"}
                    </button>
                </p>

                <p className="login-footer">
                    © 2026 MEDCORE. All Rights Reserved.
                </p>

            </div>

        </div>
    );
}

export default Login;