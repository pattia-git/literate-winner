import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import "./navbar.css";

function Navbar() {
    const { user } = useContext(AuthContext);

    return (
        <nav>
            <header id="navbar">
                <div id="title">
                    <NavLink to="/" id="Homepage">My Website</NavLink>
                </div>
                <div id="linksLayout">
                    <div id="links">
                        <NavLink to="/about" id="Link">About Me</NavLink>
                        <NavLink to="/projects" id="Link">Projects</NavLink>
                        <NavLink to="/blog" id="Link">Blog</NavLink>
                        <NavLink to="/contact" id="Link">Contact</NavLink>
                        <NavLink to="/resume" id="Link">Resume</NavLink>
                    </div>
                    <div id="Login">
                        {user ? (
                            <NavLink to="/myPage" id="Link">{user.username}</NavLink>
                        ) : (
                            <NavLink to="/login" id="Link">Login</NavLink>
                        )}
                    </div>
                </div>
            </header>
        </nav>
    );
}

export default Navbar;
