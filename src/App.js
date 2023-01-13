/** @format */

import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Logo from "./components/Logo";

function App() {
  return (
    <div className='app'>
      <div className='desktop-only'>
        {/* <NavBar /> */}
        <Routes>
          <Route path='/' element={<Home />} />
          {/* <Route path='/projects' element={<Projects />} /> */}
          {/* <Route path='/contact' element={<Contact />} /> */}
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      <div className='mobile-only'>
        <div className='logo-container'>
          <Logo />
        </div>
        <div className='text'>
          <h1>Mobile version coming soon!</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
