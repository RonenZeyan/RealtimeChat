import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePages from './pages/HomePages';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route path='/' element={<HomePages />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/Profile' element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App