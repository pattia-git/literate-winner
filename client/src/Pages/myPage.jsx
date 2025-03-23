import React, {useContext} from "react";
import { AuthContext } from "../Components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


export const MyPage = () => {
    
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const clearSession = async () => {
        const response = await fetch('/api/clear-session', { method: 'DELETE', credentials: 'include' })
        updateUser();
        navigate("/")
    }


    
    return(
        <div id="Page">
            <h2>My Page</h2>
            <h3>Your information:</h3>
            <p>ID: {user.userId}</p>
            <p>Username: {user.username}</p>
            <p>Firstname: {user.fname}</p>
            <p>Lastname: {user.lname}</p>
            <p>Role: {user.role}</p>
            <p>Email: {user.email}</p>
            <button onClick={clearSession}>Log out</button>
        </div>
    )

}