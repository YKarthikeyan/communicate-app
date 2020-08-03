import React from 'react'
import ChatHeading from './ChatHeading'
import Messages from './Messages'
import MessageTypingBox from './MessageTypingBox'
import '../../index.css'
import './css/ChatContainer.css'


function ChatContainer({user, activeChat, sendMessage, sendTyping}) {

    return (
        <>
            {
            activeChat !== null ?
                <div className="CC-outer">
                    <ChatHeading name={activeChat.name} />
                    <Messages
                        messages={activeChat.messages}
                        user={user}
                        typingUsers={activeChat.typingUsers}
                    />
                    <MessageTypingBox
                        sendMessage={sendMessage}
                        sendTyping={sendTyping}
                    />
                </div>
            :
                <div className="CC-outer">
                    <div className="empty">
                        <div>Choose a chat</div>
                    </div>
                </div>

        }
        </>
    )
}

export default ChatContainer
