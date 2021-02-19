import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
// Component
import Menu from '../menu/Menu';
import Form from '../form/Form';

const Main = () => {
  const initialState = {
    choice: 0,
    name: '',
    room: '',
    loading: false
  };
  const [socket, setSocket] = useState(null);
  const [session, setSession] = useState(initialState);
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

  // Updates the values of 'session' state
  const onChange = e => {
    const field = e.target.name;
    setSession({ ...session, [field]: e.target.value });
  }

  const goBack = _ => {
    setSession(initialState)
  }

  // Sets 'session.choice' state to either 1 (new game) or 2 (join game)
  const onGameSelect = choice => {
    setSession({ ...session, choice }); 
  }

  // Render Components depending on session.choice value
  if(session.choice !== 0) {
    return (
      <Form 
        choice={session.choice} 
        name={session.name} 
        room={session.room} 
        onChange={onChange} 
        goBack={goBack}
      />
    );
  } else {
    return (
      <Menu onGameSelect={onGameSelect} />
    );
  }  
}

export default Main;