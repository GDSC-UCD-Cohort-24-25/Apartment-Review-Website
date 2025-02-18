import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'

//import components
import Listings from './pages/Listings/Listings'
import Home from './pages/Home/Home'
import Map from './pages/Map/Map'
import Rankings from './pages/Rankings/Rankings'
import Profile from './pages/Profile/Profile'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import ApartmentInfo from './pages/ApartmentInfo/ApartmentInfo'

//styles
import "./App.css";


function App() {
  return (
    <main className="app-styles">  
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/listings" element={<Listings/>} />
        <Route path="/map" element={<Map/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/rankings" element={<Rankings/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </main>
  )
}

export default App
