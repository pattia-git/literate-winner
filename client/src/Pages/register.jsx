import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

export const Register = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [tempPassword, setPassword] = useState('');
    const [verifyPassword, setVPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tempPassword === verifyPassword) {
            
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(tempPassword, salt);
            
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    Email: email,
                    Firstname: fname,
                    Lastname: lname,
                    Username: username,
                    Password: password
                }),
            });
            // Handle the response if necessary, for example:
            if (response.ok) {
                navigate("/login")
            } else {
                console.log("Something went wrong")
            }
            return;
        }

        alert("Passwords do not match!");
    };

    return (
        <div id="Page">
            <h2>Register</h2>
            <div id="loginLayout">
                <form onSubmit={handleSubmit}>
                    <div id="fnamePrompt">
                        <p>Firstname</p>
                        <input
                            placeholder="First name"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                            required
                        />
                    </div>

                    <div id="lnamePrompt">
                        <p>Lastname</p>
                        <input
                            placeholder="Last name"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                            required
                        />
                    </div>

                    <div id="usernamePrompt">
                        <p>Username</p>
                        <input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div id="emailPrompt">
                        <p>Email</p>
                        <input
                            placeholder="Enter your email"
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
                            value={tempPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div id="verifyPasswordPrompt">
                        <p>Verify Password</p>
                        <input
                            placeholder="Confirm your password"
                            type="password"
                            value={verifyPassword}
                            onChange={(e) => setVPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};
