import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/AuthContext.jsx"; // Import auth context

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { updateUser } = useContext(AuthContext); // Use context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ Email: email, Password: password })
            });

            const data = await response.json();
            console.log('Login Response:', data);

            if (response.ok) {
                console.log("Login successful");
                updateUser();
                navigate(data.user.role === "ADMIN" ? "/Admin" : "/");
            } else {
                setError(data.message || "Invalid login credentials");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error("Login error:", err);
        }
    };

    return (
        <>
            <h1>Please Log In</h1>
            <div id="loginPage">
                <div id="loginLayout">
                    <form onSubmit={handleSubmit}>
                        <div id="emailPrompt">
                            <p>Email</p>
                            <input
                                placeholder="Enter your email or username"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div id="passwordPrompt">
                            <p>Password</p>
                            <input
                                placeholder="Enter your password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <button type="submit">Login</button>
                    </form>
                    <button onClick={() => navigate("/register")}>Register</button>
                </div>
            </div>
        </>
    );
};
