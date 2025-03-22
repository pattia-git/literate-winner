import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/navbar.jsx"
import {About} from "./Pages/about.jsx"
import {Contact} from "./Pages/contact.jsx"
import {Projects} from "./Pages/projects.jsx"
import {Blog} from "./Pages/blog.jsx"
import {Resume} from "./Pages/resume.jsx"
import {Home} from "./Pages/Home.jsx"
import {Login} from "./Pages/login.jsx"

function App() {

  return (
      <div>
        <Navbar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/projects" element={<Projects/>}/>
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/resume" element={<Resume/>}/>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
  )
}

export default App
