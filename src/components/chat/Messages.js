import React,{useEffect} from 'react'
import '../../index.css'
import './css/ChatContainer.css'


function Messages({ messages, user, typingUsers }) {
    useEffect(() => {
        var dom = document.getElementsByClassName('CC-messages')[0];
        dom.scrollTop = dom.scrollHeight;
    })

    return (
        <div className='CC-messages'>
            <div className='CC-dummy-space'></div>
            {
                messages.map((message, index) => {
                    var className = 'CC-message '
                    className+= (message.sender === user.name) ? 'div-right' : 'div-left'
                    return (
                        <div className='CC-message-wrapper' key={message.id}>
                            <div
                            className= {className}>
                                <div className='CC-message-sender'>{message.sender}</div>
                                <div className='CC-message-text'>{message.message}</div>
                                <div className='CC-message-time'>{message.time}</div>
                            </div>
                        </div>
                    )
                })
            }
            {
                typingUsers.map(name => {
                    return (
                        <div className='CC-message-istyping'
                        key={name}>
                            {`${name} is typing...`}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Messages
