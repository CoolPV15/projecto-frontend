import { useState, useEffect } from 'react'
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import Signup from "./Registration/Signup.jsx"
import Signin from "./Registration/Signin.jsx"
import Home from "./Dashboard/home.jsx"
import { AuthProvider } from './context/AuthProvider.jsx'
import "./App.css"
import { DashboardProvider } from './context/DashboardContext.jsx'

function App() {
  {/*
    Using Routers for efficient navigation between different web pages in the website
    */}

  return(
    <>
    <Router>
      <AuthProvider>
        <DashboardProvider>
        <Routes>
        <Route path="/" element={<Signin />}></Route>
        <Route path="signup" element={<Signup />}></Route>
        <Route path="home" element={<Home />}></Route>
        </Routes>
        </DashboardProvider>
      </AuthProvider>
    </Router>
    </>
  )

}

export default App