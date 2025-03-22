import {React, useState}from "react";

export const Login = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    
    
    return(
        <div>
            <div id="loginLayout">
                <form>
                    <div>
                        <p>Email</p>
                        <input
                            placeholder="Enter your email or username"
                            type="Email"
                            required
                        />
                    </div>

                    <div>
                        <p>Password</p>
                        <input
                            placeholder="Enter your password"
                            type="password"
                            required
                        />
                    </div>

                    <button>Login</button>
                </form>
                <button>Register</button>
            </div>
        </div>
    )
}