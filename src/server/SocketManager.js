// const EVENTS = require( '../Events')
// var io = require('./index')
// const {VERIFY_USER, USER_CONNECTED, LOGOUT, USER_DISCONNECTED, COMMUNITY_CHAT, MESSAGE_RECEIVED, MESSAGE_SENT} = require('../Events.js')
// const {createUser, createMessage, createChat} = require('../ObjectFactory')

// var connectedUsers = {};
// var communityChat = createChat()



// const SocketManager = (socket) => {
//     let sendMessageToChatFromUser;

//     const sendMessageToChat = (sender) => {
//         return (chatId, message) => {
//             console.log(chatId, message);
//             // socket.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
//             io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}))
//         }
//     }

//     socket.on(VERIFY_USER, (name, callback) => {
//         isUser(connectedUsers, name)
//         ? callback({user:null, isUser:true})
//         : callback({user:createUser({name:name}), isUser:false})
//     })

//     socket.on(USER_CONNECTED, (user) => {
//         connectedUsers = addUser(connectedUsers, user);
//         socket.user = user;
//         sendMessageToChatFromUser = sendMessageToChat(user.name)
//         socket.emit(USER_CONNECTED, connectedUsers)
//         // console.log(connectedUsers);
//     })

//     socket.on('disconnect', () => {
//         if('user' in socket){
//             connectedUsers = removeUser(connectedUsers, socket.user.name)
//             socket.emit(USER_DISCONNECTED, connectedUsers)
//         }
//     })

//     socket.on(LOGOUT, () => {
//         connectedUsers = removeUser(connectedUsers, socket.user.name)
//         socket.emit(USER_DISCONNECTED, connectedUsers)
//         // console.log('logout',connectedUsers)
//     })

//     socket.on(COMMUNITY_CHAT, (callback) => {
//         callback(communityChat)
//     })

//     socket.on(MESSAGE_SENT, ({chatId, message}) =>{
//         sendMessageToChatFromUser(chatId, message)
//     })

// }


// const isUser = (connectedUsers, name) => {
//     return name in connectedUsers
// }

// const removeUser = (connectedUsers, name) => {
//     delete connectedUsers[name]
//     return connectedUsers
// }

// const addUser = (connectedUsers, user) => {
//     connectedUsers[user.name] = user
//     return connectedUsers
// }




// module.exports = SocketManager