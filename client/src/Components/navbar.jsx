import {NavLink} from "react-router"

import "./navbar.css";

function navbar(){
    return(
        <nav>
            <header id="navbar">
                <div id="title">
                    <NavLink to="/" id="Homepage">My website</NavLink>
                </div>

                <div id="linksLayout">
                    <div id="links">
                        <NavLink to="/about" id="Link">About me</NavLink>
                        <NavLink to="/projects" id="Link">Projects</NavLink>
                        <NavLink to="/blog" id="Link">Blog</NavLink>
                        <NavLink to="/contact" id="Link">Contact</NavLink>
                        <NavLink to="/resume" id="Link">Resume</NavLink>
                    </div>
                    <div id="Login">
                        Login
                    </div>
                </div>

            </header>
        </nav>)
}

export default navbar;

