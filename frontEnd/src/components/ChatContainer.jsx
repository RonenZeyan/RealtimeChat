import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { FormatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const ChatContainer = () => {

  //its equal to document.getElementById("div_we_create_in_bottom")
  const scrollEnd = useRef();

  //useContext Hook
  const { selectedUser, setSelectedUser, getMessages, messages, sendMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  //useStateHooks
  const [input, setInput] = useState("");

  useEffect(() => {
    if (scrollEnd.current && messages) {
      /*
        we get the element div in bottom
        (set ref attribute in div equal to document.getElementById("div_we_create_in_bottom")) 
        and each element have the function scrollIntoView 
        then we use it and this function scroll until the element it belong to him display for us
      */
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  //useEffect for get messages of selected User
  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id);
    }
  },[selectedUser])

  //handle send message
  async function handleSendMessage(e) {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  }

  //handle send image
  async function handleSendImage(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = ""
    }
    reader.readAsDataURL(file);
  }


  return (

    selectedUser ? (
      <div className='h-full overflow-scroll relative backdrop-blur-lg' >

        {/* Chat User Details (Header) */}
        <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="UserProfilePic" className='w-8 rounded-full' />
          <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
          </p>
          <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="arrow icon" className='md:hidden max-w-7' />
          <img src={assets.help_icon} alt="arrow icon" className='max-md:hidden max-w-5' />
        </div>

        {/* chat details/area */}
        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
          {
            messages.map((msg, idx) => (
              <div key={idx} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                {msg.image ? (
                  <img onClick={()=>window.open(msg.image,"_blank")} src={msg.image} alt='sended Image' className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 cursor-zoom-in' />
                ) :
                  (
                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all text-white ${msg.senderId === authUser._id ? 'rounded-br-none bg-green-500' : 'rounded-bl-none bg-violet-500/30'}`}>{msg.text}</p>
                  )
                }
                <div className='text-center text-xs'>
                  <img className='w-7 rounded-full' src={msg.senderId === authUser._id ? authUser?.profilePic||assets.avatar_icon : selectedUser?.profilePic||assets.avatar_icon } alt="user pic" />
                  <p className='text-gray-500'>{FormatMessageTime(msg.createdAt)}</p>
                </div>
              </div>
            )
            )
          }
          <div ref={scrollEnd}></div>
        </div>
        {/* bottom area */}
        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
            <input onChange={(e) => { setInput(e.target.value) }} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} value={input} type="text" placeholder='Send a message ...' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' />
            <input onChange={handleSendImage} type="file" id='image' accept='image/png image/jpeg' hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="icon" className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>
          <img onClick={handleSendMessage} src={assets.send_button} alt="send" className='w-7 cursor-pointer' />
        </div>

      </div >
    ) : (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img src={assets.logo_icon} alt="logo" className='max-w-16' />
        <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
      </div>
    )
  )
}

export default ChatContainer