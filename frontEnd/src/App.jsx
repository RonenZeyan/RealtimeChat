import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePages from './pages/HomePages';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from "react-hot-toast";
import { AuthContext } from '../context/AuthContext';
import Loader from './lib/loader.jsx';

const App = () => {

  const { authUser, loading } = useContext(AuthContext);

  return (
    <div className="bg-[url('https://t3.ftcdn.net/jpg/06/22/74/68/360_F_622746859_cXHdOtRmWcDqW5AU849pjvqxqi5HZ9eS.jpg')] bg-cover">
      <Toaster />
      <Routes>
        <Route path='/' element={loading ? <Loader /> : authUser ? <HomePages /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/Profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )

}
export default App;