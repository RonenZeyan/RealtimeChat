import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currState, setCurrState] = useState("Register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmited, setIsDataSubmited] = useState(false);

  //get context
  const { login } = useContext(AuthContext);

  async function handleSubmitForm(e) {
    e.preventDefault();
    if (currState === "Register" && !isDataSubmited) {  //register before bio
      setIsDataSubmited(true);
      console.log({ fullName, email, password });
      return;
    }

    login(currState === "Register" ? "Register" : "Login", { fullName, email, password, bio })

  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* left */}
      <img src={assets.logo_big} alt="logo" className='w-[min(30vw,250px)]' />

      {/* right */}
      <form onSubmit={(e) => handleSubmitForm(e)} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>{currState}
          {isDataSubmited && <img src={assets.arrow_icon} onClick={() => { setIsDataSubmited(false) }} alt="arrow icon" className='w-5 cursor-pointer' />}
        </h2>
        {currState === "Register" && !isDataSubmited && (
          <input onChange={(e) => { setFullName(e.target.value) }} value={fullName} type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )}
        {!isDataSubmited && (
          <>
            <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="email" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Email' required />
            <input onChange={(e) => { setPassword(e.target.value) }} value={password} type="password" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='password' required />

          </>
        )}

        {
          currState === "Register" && isDataSubmited && (
            <textarea onChange={(e) => { setBio(e.target.value) }} value={bio} rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Set A Bio...'></textarea>
          )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Register" ? "Register Now" : "Sign In"}
        </button>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {
            currState === "Register" ? (
              <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => { setCurrState("Login"); setIsDataSubmited(false) }} className='font-medium text-violet-600 cursor-pointer'>Login Here</span></p>
            ) : (
              <p className='text-sm text-gray-600'>Create an account <span onClick={() => { setCurrState("Register"); }} className='font-medium text-violet-600 cursor-pointer'>Click Here</span></p>
            )
          }
        </div>
      </form>
    </div>
  )
}

export default LoginPage