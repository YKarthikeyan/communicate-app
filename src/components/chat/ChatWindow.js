import React from 'react'
import SideBar from './SideBar'
import ChatContainer from './ChatContainer'

import {MESSAGE_SENT, MESSAGE_RECEIVED, TYPING, COMMUNITY_CHAT, PRIVATE_MESSAGE} from '../../Events'
import '../../index.css'
import './css/ChatWindow.css'

class ChatWindow extends React.Component {
    constructor(props) {
        super();
        this.state ={
            chats : [],
            activeChat :null
        }
    }


    addMessageToChat = (chatId) => {
        return (message) => {
            const {chats} = this.state;
            // console.log(message, chats)
            let newChats = chats.map(chat => {
                if(chat.id === chatId){
                    chat.messages.push(message)
                }
                return chat
            })
            this.setState({chats:newChats})
        }
    }


    addChat = (chat, reset=false) => {
        const {chats} = this.state;
        const {socket} =this.props;
        const newChats = reset ? [chat] : [...chats, chat];
        this.setState({chats: newChats, activeChat: reset ? chat : this.state.activeChat});

        const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`
        const typingEvent  = `${TYPING}-${chat.id}`

        socket.on(typingEvent, this.updateTypingInChat(chat.id))
        socket.on(messageEvent, this.addMessageToChat(chat.id))
    }

    resetChat = (chat) => {
        return this.addChat(chat, true);
    }

    componentDidMount(){
        const {socket} = this.props;
        this.initSocket(socket);
    }

    initSocket = (socket) => {
        socket.emit(COMMUNITY_CHAT, this.resetChat);
        socket.on(PRIVATE_MESSAGE, this.addChat);
        socket.on('connect', () => {
            //socket.emit(COMMUNITY_CHAT, this.resetChat);
        });
    }

    sendOpenPrivateMessage = (receiver) => {
        const {socket, user} = this.props;
        const {activeChat} = this.state;
        socket.emit(PRIVATE_MESSAGE, {receiver:receiver,sender:user.name, activeChat: activeChat});
    }

    sendMessage = (chatId, message) => {
        const {socket} = this.props; //console.log('mess sent', socket.id)
        socket.emit(MESSAGE_SENT, {chatId, message})
    }

    sendTyping = (chatId, isTyping) => {
        const {socket} = this.props;
        socket.emit(TYPING, {chatId, isTyping})
    }

    setActiveChat = chat =>{
        this.setState({activeChat: chat})
    }

    updateTypingInChat = chatId => {
        return ({isTyping, user}) => {
            if(user !== this.props.user.name){
                const {chats} = this.state;
                let newChats = chats.map(chat => {
                    if(chat.id === chatId){
                        if(isTyping && !chat.typingUsers.includes(user)){
                            chat.typingUsers.push(user);
                        }
                        else if (!isTyping && chat.typingUsers.includes(user)){
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user);
                        }
                    }
                    return chat;
                })
                this.setState({chats:newChats})
            }
        }
    }


    render(){
        const {user, userLogout} = this.props;
        const {chats, activeChat} = this.state;
        return (
            <div className='CW-outer'>
            <SideBar
                chats={chats}
                activeChat={activeChat}
                setActiveChat={this.setActiveChat}
                user={user}
                userLogout={userLogout}
                onSendPrivateMessage={this.sendOpenPrivateMessage}
                />
                <ChatContainer
                user={user}
                activeChat={activeChat}
                sendMessage={message => this.sendMessage(activeChat.id, message)}
                sendTyping={isTyping => this.sendTyping(activeChat.id, isTyping)}
                />
            </div>
        )
    }
}

export default ChatWindow
