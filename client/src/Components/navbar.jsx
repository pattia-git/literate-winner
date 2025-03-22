import {NavLink} from "react-router"

import "./navbar.css";

function navbar(){
    return(
        <nav>
            <header id="navbar">
                <NavLink to="/">Home</NavLink>
                <div id="links">
                    <NavLink to="/about">About me</NavLink>
                    <NavLink to="/projects">Projects</NavLink>
                    <NavLink to="/blog">Blog</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                    <NavLink to="/resume">Resume</NavLink>
                </div>
            </header>
        </nav>)
}

export default navbar;

