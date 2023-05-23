import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [messageValue, setMessageValue] = useState('')
  const [users, setUsers] = useState<{userId: number, userName:string,message:string}[]>([])
  const [ws, setWs] = useState<WebSocket | null>(null);
  const bottomRef = useRef(null);


  if(ws) {
    ws.onmessage = (messageEvent) => {
      setUsers([...users, ...JSON.parse(messageEvent.data)]);
      window.scrollTo(0, document.body.scrollHeight);

    }
  }

  useEffect(() => {
    let localWs = new WebSocket('wss://social-network.samuraijs.com/handlers/ChatHandler.ashx');

    setWs(localWs)
  }, [])

  useEffect(() => {
    (bottomRef.current as unknown as HTMLDivElement)?.scrollIntoView({ behavior: 'smooth' })
  }, [users]);

  const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessageValue(e.currentTarget.value)
  }

  const sendMessage = (): void => {
    ws?.send(messageValue)
    setMessageValue('')
  }


  return (
    <div className="App">
      <div className="chat">
        <div className="messages">

        {users?.map((el, i) => <div className="message" key={i}>
            <img src='http://via.placeholder.com/50x50'/>
             <b>{el.userName}</b> <span>{el.message}</span>
          </div>)
          }
        </div>

        <div className="footer">
          <textarea onChange={onMessageChange} value={messageValue}/>
          <button onClick={sendMessage}>Send</button>
        </div>
        <div ref={bottomRef} />

      </div>
    </div>
  );
}

export default App;
