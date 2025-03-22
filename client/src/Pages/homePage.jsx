import {NavLink} from "react-router"

function homePage(){
    return(
        <>
            <header id="navbar">
                <div id="general-info">
                    <h1 id="title">Homepage</h1>
                </div>
                <div id="links">
                    <NavLink to="">About me</NavLink>
                    <NavLink to="">Projects</NavLink>
                    <NavLink to="">Blog</NavLink>
                    <NavLink to="">Contact</NavLink>
                    <NavLink to="">Resume</NavLink>
                </div>
            </header>
        </>)
}

export default homePage;

