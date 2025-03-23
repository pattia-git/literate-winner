import { createContext, useState, useEffect } from "react";
import checkAuth from "./checkSession.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const fetchUser = async () => {
        const authUser = await checkAuth();
        setUser(authUser);
    };
    
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, updateUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};
