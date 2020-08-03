import React from 'react'
import LoginWindow from './login/LoginWindow'
import ChatWindow from './chat/ChatWindow'
import io from 'socket.io-client'
import {USER_CONNECTED, LOGOUT, VERIFY_USER} from '../Events.js'

//const socketURL = 'http://localhost:4000';
// const socketURL = 'http://192.168.43.10:4000';
const socketURL = '/';


class AppLayout extends React.Component {
   constructor(props){
       super(props);
       this.state = {
           user : null,
           socket : null
       }
       this.userLogin = this.userLogin.bind(this)
	  this.userLogout = this.userLogout.bind(this)
	  this.reconnectUserInfo = this.reconnectUserInfo.bind(this)
   }
   componentDidMount =() => {
        var socket = io(socketURL);
        this.setState({socket});
        this.initSocket(socket);
    }


    initSocket = (socket) => {
		socket.on('connect', ()=>{
                //console.log("Connected");
		})
		socket.on('disconnect', this.reconnectUserInfo)
	}


    reconnectUserInfo(){ console.log('reconnected')
		const { socket, user } = this.state
		if(this.state.user != null){
			socket.emit(USER_CONNECTED, user)
		}

	}


    userLogin(user){
        const {socket} = this.state
        socket.emit(USER_CONNECTED, user);
        this.setState({user})
    }

    userLogout(){
        const {socket} = this.state
        this.setState({user:null})
        socket.emit(LOGOUT);
    }

    render(){
        const {socket, user} = this.state;
        return (
            <>
                {
                    !user
                    ?
                        <LoginWindow socket={socket} userLogin={this.userLogin} />
                    :
                        <ChatWindow socket={socket} user={user} userLogout={this.userLogout}/>
                }
            </>
        );
    }
}

export default AppLayout;
