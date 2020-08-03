import React  from 'react'
import '../../index.css'

class MessageTypingBox extends React.Component{
    constructor(){
        super();
        this.state = {
            message: '',
            isTyping: false
        }
    }

    handleSubmit = (ev) => {
        ev.preventDefault()
        this.sendMessage()
        this.setState({message:''})
    }

    sendMessage = () => {
        this.props.sendMessage(this.state.message)
    }

    componentWillUnmount() {
        this.stopCheckingTyping();
    }

    sendTyping = () => {
        this.lastUpdateTime = Date.now();
        if (!this.state.isTyping){
            this.setState({ isTyping: true })
            this.props.sendTyping(true);
            this.startCheckingTyping()
        }
    }

    startCheckingTyping = () => {
        // console.log('typing');
        this.typingInterval = setInterval(() => {
            if((Date.now() - this.lastUpdateTime) > 300){
                this.setState({ isTyping: false});
                this.stopCheckingTyping()
            }
        }, 300)
    }

    stopCheckingTyping = () => {
        // console.log('stop typing');
        if(this.typingInterval){
            clearInterval(this.typingInterval);
            this.props.sendTyping(false);
        }
    }


    render(){
        const {message} = this.state;
        return (
            <div className='CC-typingBox'>
                <form onSubmit={this.handleSubmit}>
                     <textarea rows='4' cols='60'
                        type='text'
                        value={message}
                        placeholder='Enter text ...'
                        onChange={(ev) => this.setState({message: ev.target.value})}
                        onKeyUp={ev => {
                            (ev.keyCode !== 13) ? this.sendTyping():
                            !ev.shiftKey && this.handleSubmit(ev) ;
                        }}
                    />
                    <button
                        disabled ={message.length < 1}
                        type='submit'>
                        <i className='bx bx-send'></i>
                    </button>
                </form>
            </div>
        )
    }
}

export default MessageTypingBox
