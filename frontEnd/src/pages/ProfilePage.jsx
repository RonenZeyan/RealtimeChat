import React, { useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from "react-router-dom"

const ProfilePage = () => {

  //useState Hooks
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState("Martin Johnson");
  const [bio, setBio] = useState("hi everyone Iam Using RonenChat");

  //useNavigate Hooks
  const nav = useNavigate();

  //handle Submit Form
  async function handleSubmitForm(e){
    e.preventDefault();
    alert(console.log({name,bio}));
    nav("/")
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center items-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmitForm} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => { setSelectedImg(e.target.files[0]) }} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="avatar icon" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
            Upload Profile Image
          </label>
          <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" required placeholder='Your Name' className='p-2 border focus:ring-violet-500 border-gray-500 rounded-md focus:outline-none focus:ring-2' />
          <input onChange={(e) => { setBio(e.target.value) }} rows={4} value={bio} type="text" required placeholder='Your Bio' className='p-2 border focus:ring-violet-500 border-gray-500 rounded-md focus:outline-none focus:ring-2' />
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Update Your Profile</button>
        </form>
        <img className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' src={assets.logo_icon} alt="Chat Logo" />
      </div>
    </div>
  )
}

export default ProfilePage