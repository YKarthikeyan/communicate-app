const express = require('express');
const app     = express();
const http    = require('http').createServer(app);
const io      = require('socket.io')(http);
const EVENTS  = require( '../Events')
const {VERIFY_USER, USER_CONNECTED, LOGOUT, USER_DISCONNECTED,
     COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT, TYPING, PRIVATE_MESSAGE} = require('../Events.js')
const {createUser, createMessage, createChat} = require('../ObjectFactory')

const PORT = process.env.PORT || 3231;
// const PORT = 4000;
let connectedUsers = {};
let communityChat = createChat()

app.use(express.static(__dirname + '/../../build'))
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');});

io.on('connection', SocketManager);

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});



 function SocketManager(socket){

    let sendMessageToChatFromUser;
    let sendTypingFromUser;
    const sendMessageToChat = (sender) => {
        return (chatId, message) => {
            //console.log(sender, message);
            io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
        }
    }

    const sendTypingToChat = user => {
        return (chatId, isTyping) => {
            io.emit(`${TYPING}-${chatId}`, {user, isTyping});
        }
    }

    socket.on(VERIFY_USER, (name, callback) => {
        isUser(connectedUsers, name)
        ? callback({user:null, isUser:true})
        : callback({user:createUser({name:name, socketId:socket.id}), isUser:false})
    })

    socket.on(USER_CONNECTED, (user) => {
        user.socketId = socket.id;
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;
        sendMessageToChatFromUser = sendMessageToChat(user.name);
        sendTypingFromUser = sendTypingToChat(user.name);
        io.emit(USER_CONNECTED, connectedUsers)
    //    console.log('on connect')
    //    console.log(user.name)
    //    console.log(connectedUsers)

    })

    socket.on('disconnect', () => {
        // if(!!socket.user){
        if('user' in socket){
            socket.disconnect();
             connectedUsers = removeUser(connectedUsers, socket.user.name)
             io.emit(USER_DISCONNECTED, connectedUsers)
            }
            // console.log('on disconnect')
            // console.log(connectedUsers)

    })

    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name)
        io.emit(USER_DISCONNECTED, connectedUsers)
        //console.log(' on logout' , connectedUsers)

    })

    socket.on(COMMUNITY_CHAT, (callback) => {
        callback(communityChat)
    })

    socket.on(MESSAGE_SENT, ({chatId, message}) =>{ //console.log('mess sent', socket.id); console.log(Object.keys(io.sockets.sockets).length)
        sendMessageToChatFromUser(chatId, message)
    })

    socket.on(TYPING, ({chatId, isTyping}) => {
        sendTypingFromUser(chatId, isTyping)
    })

    socket.on(PRIVATE_MESSAGE, ({receiver, sender, activeChat}) => {
        if(receiver in connectedUsers){
            const receiverSocket = connectedUsers[receiver].socketId;
            if(activeChat === null || activeChat.id === communityChat.id){
                const newChat = createChat({name: `${receiver}`, users:[receiver, sender]});
                socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
                socket.emit(PRIVATE_MESSAGE, newChat);
            } else {
                socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat)
            }

        }
    })

}


const isUser = (connectedUsers, name) => {
    return name in connectedUsers
}

const removeUser = (connectedUsers, name) => {
    // let newList = Object.assign({}, connectedUsers)
    // delete newList[name]
    // return newList
    delete connectedUsers[name]
    return connectedUsers
}

const addUser = (connectedUsers, user) => {
    // let newList = Object.assign({}, connectedUsers)
    // newList[user.name] = user
    // return newList
    connectedUsers[user.name] = user;
    return connectedUsers
}
