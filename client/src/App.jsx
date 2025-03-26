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
import {MyPage} from "./Pages/myPage.jsx"
import {Admin} from "./Pages/admin.jsx"
import {Register} from "./Pages/register.jsx"
import {AuthProvider} from "./Components/AuthContext.jsx"
import {NewBlogPost} from "./Pages/newBlogPost.jsx"

function App() {

  return (
      <AuthProvider>
        <Navbar/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/projects" element={<Projects/>}/>
            <Route path="/blog" element={<Blog/>}/>
            <Route path="/resume" element={<Resume/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/blog/New-post" element={<NewBlogPost/>}/>
          </Routes>
        </AuthProvider>
  )
}

export default App
