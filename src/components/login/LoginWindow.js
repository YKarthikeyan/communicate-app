import React, { useState } from 'react'
import { VERIFY_USER } from '../../Events'
import './Login.css'
import landing from '../../img/5551.jpg'
import logo from '../../img/logo.png'


function LoginWindow({ socket, userLogin }) {

    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const setUser = ({ user, isUser }) => {
        if (isUser) {
            setError('Username taken!')
        } else {
            setError("") //set state before component unmounts
            userLogin(user) //this unmounts loginWindow component

        }
    }

    const submitHandler = (ev) => {
        ev.preventDefault();
        socket.emit(VERIFY_USER, name, setUser)
    }

    return (
        <>
            <div className="LP-Overlay">
                <div className='LP-logo'>
                    <img src={logo} alt='logo'/>
                </div>
                <div className="LP-Cover">
                    <div className="LP-LoginForm">
                        <div className="title">login</div>
                        <div className="con-input">
                            <input
                                type="text"
                                placeholder="User"
                                onChange={ev => {
                                    setError('');
                                    setName(ev.target.value)}}
                                value={name} />
                            <i className='bx bx-user icon'></i>
                            <div className="bg"></div>
                            {error && <div className="LP-Error">{error}</div>}
                        </div>
                        <button className='enter' onClick={submitHandler}>Enter</button>
                    </div>
                    <div className="LP-Banner">
                        <img src={landing} alt="cover" />
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoginWindow
