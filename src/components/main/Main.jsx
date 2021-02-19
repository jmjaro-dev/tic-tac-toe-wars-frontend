import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Redirect } from 'react-router-dom';
// Component
import Menu from '../menu/Menu';
import Form from '../form/Form';

const Main = () => {
  const initialState = {
    choice: 0,
    name: '',
    room: '',
    roomCreated: false,
    gameCreate: false
  };
  const [socket, setSocket] = useState(null);
  const [session, setSession] = useState(initialState);
  const ENDPOINT = 'http://localhost:5000/';

  useEffect(() => {
    if(socket === null) {
      // Initialize Socket Connection to server 
      setSocket(socketIOClient(ENDPOINT));
    } else {
      if(session.gameCreate) {
        // Listen for 'roomCreated' event from server
        socket.on("roomCreated", ({ id }) => {
          setSession({ ...session, room: id, roomCreated: true });
        });
      }
    }
  }, [socket, session]); 

  // Updates the values of 'session' state
  const onChange = e => {
    const field = e.target.name;
    setSession({ ...session, [field]: e.target.value });
  }

  // Resets the state
  const goBack = _ => {
    setSession(initialState);
  }

  // Sets 'session.choice' state to either 1 (new game) or 2 (join game)
  const onGameSelect = choice => {
    setSession({ ...session, choice }); 
  }

  const onSubmit = e => {
    e.preventDefault();
    
    if(session.choice === 1) {
      setSession({ ...session, gameCreate: true });
      socket.emit("createGame", session.name);
    } else {
      socket.emit("joinGame", { room: session.room });
    }
  }

  // Check if room is already Created by server
  if(session.roomCreated) {
    return (
      <Redirect to={`/game?room=${session.room}&name=${session.name}`} />
    )
  } else {
    // Render Components depending on session.choice value
    if(session.choice !== 0) {
      return (
        <Form 
          choice={session.choice} 
          name={session.name} 
          room={session.room} 
          onChange={onChange}
          onSubmit={onSubmit} 
          goBack={goBack}
        />
      );
    } else {
      return (
        <Menu onGameSelect={onGameSelect} />
      );
    } 
  }  
}

export default Main;