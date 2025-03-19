import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/homePage.jsx"

function App() {

  return (
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
  </Routes>
</BrowserRouter>
  )
}

export default App
