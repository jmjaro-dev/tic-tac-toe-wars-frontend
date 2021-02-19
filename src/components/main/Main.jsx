import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
// Component
import Menu from '../menu/Menu';
import Form from '../form/Form';

const Main = () => {
  const [socket, setSocket] = useState(null);
  const [session, setSession] = useState({
    choice: null,
    name: '',
    room: '',
    loading: false,
    isNewGame: false
  });
  const ENDPOINT = 'http://localhost:5000/';

  // Initialize Socket Connection to server 
  useEffect(() => {
    if(socket === null) {
      setSocket(socketIOClient(ENDPOINT));
    } else {
      socket.on("connect", () => {
        console.log("connected");
      });
    }
  }, [socket]); 

  // Render Components depending on session.choice value
  if(session.choice !== null) {
    return (
      <Form />
    );
  } else {
    return (
      <Menu />
    );
  }  
}

export default Main;