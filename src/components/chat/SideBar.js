import React, { useRef, useState, useEffect } from 'react'
import '../../index.css'
import './css/SideBar.css'
import logo from '../../img/logo.png'

function SideBar({ userLogout, chats, user, activeChat, setActiveChat, onSendPrivateMessage }) {
    const usersRef = useRef(null);
    const [receiver, setReceiver] = useState('');

    const handleSubmit = (ev) => {
        ev.preventDefault();
        onSendPrivateMessage(receiver);
        setReceiver('');
    }

    const clearActiveCSS = (ev) => {
        const activeElement = ev.target.getElementsByClassName('active')[0];
        activeElement && activeElement.classList.remove('active');
    }

    useEffect(() => {
        var usersArr = document.getElementsByClassName('SB-user');
        for(let i=0;i<usersArr.length;i++){
            usersArr[i].addEventListener('click', function(ev){
                const prevActiveElement = ev.currentTarget.parentElement.getElementsByClassName('active')[0];
                prevActiveElement && prevActiveElement.classList.remove('active');
                ev.currentTarget.classList.add('active')
            })
        }
    }, [chats])


    return (
        <div className='SB-outer'>
            <div className="SB-heading"><img src={logo} alt='logo'/></div>
            <form onSubmit={handleSubmit} className="SB-search" >
                <input type="text"
                placeholder="search for chat / user"
                onChange={e=>setReceiver(e.target.value)} />
            </form>
            <div className="SB-users"
                ref={usersRef}
                onClick={(ev) => { (ev.target === usersRef.current) && setActiveChat(null); clearActiveCSS(ev) }}>
                {
                    chats.map(chat => {
                        if (chat.name) {
                            const lastMessage = chat.messages[chat.messages.length - 1];
                            const chatSideName = chat.users.find(name => {
                                return name !== user.name
                            }) || 'Community'
                            return (
                                <div
                                    className="SB-user"
                                    key={chat.id}
                                    onClick={(ev) => {setActiveChat(chat)}}
                                    >
                                    <span className="icon">{chatSideName[0].toUpperCase()}</span>
                                    <div className="name">
                                        <div>{chatSideName}</div>
                                        {lastMessage && <div className="lastmessage">{(lastMessage.message.length > 20)?lastMessage.message.slice(0,20)+'...':lastMessage.message}</div>}
                                    </div>
                                </div>
                            )
                        }
                        return null
                    })
                }

            </div>
            <div className="SB-logout" >
                <span>{user.name}</span>
            <button onClick={() => { userLogout() }}><i className='bx bx-log-out'></i></button>
            </div>
        </div>
    )
}

export default SideBar
