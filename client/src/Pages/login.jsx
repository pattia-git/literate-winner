import {React, useState}from "react";

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: email,
                Password: password
            }),
        })
    }
    
    if(props.isLoggedIn) 
    {
        return (
            <h1>Welcome {}</h1>
        )
    }
    else
    {
        return (
            <>
            <h1>Please Log in</h1>
            <div id="loginPage">
                <div id="loginLayout">
                    <form onSubmit={handleSubmit}>
                        <div id="emailPrompt">
                            <p>Email</p>
                            <input
                                placeholder="Enter your email or username"
                                type="Email"
                                value={email}
                                name="Email"
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
                                name="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button>Login</button>
                    </form>
                    <button>Register</button>
                </div>
            </div>
            </>
        )
    }
}