import React from 'react'
import {Routes, Route} from "react-router-dom"

//Pages
import Login from './Pages/1.LOGIN_SIGNUP/Login'
import Home from './Pages/2.HOME/Home'

const Routing = () =>
  {
    return(
      <Routes>      
         <Route path="/" element={<Login/>} /> 
         <Route path="/home" element={<Home/>} /> 
      </Routes>
    ) 
  }

const App = () => {
 
  return (
    <>
      <Routing/>
    </> 
  )
}

export default App