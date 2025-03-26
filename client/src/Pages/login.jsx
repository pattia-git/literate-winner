import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Components/AuthContext.jsx";
import bcrypt from "bcryptjs";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { updateUser } = useContext(AuthContext); // Use context
    
    const handleLogin = async (e) => {
        const LoginResponse = await fetch('/api/setSession', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ Email: email})
        });
            updateUser();
            navigate("/")
            // Need to fetch more information from backend to 
            // redirect user to correct page:
        
            // navigate(LoginResponse.user.role === "ADMIN" ? "/Admin" : "/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ Email: email})
            });

            const data = await response.json();
            
            var test = await bcrypt.compare(password, data.user.password);
            if(test == true){
                handleLogin();
                return;
            }
            alert("Something went wrong")
            
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
