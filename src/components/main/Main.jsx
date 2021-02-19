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
    gameCreate: false,
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
      // 
      if(session.gameCreate && !session.roomCreated) {
        socket.on("roomCreated", room => {
          console.log(`Room created: ${room} `);
          setSession({ ...session, roomCreated: true, room });
        })
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
      socket.emit("createGame");
      console.log("Requesting for Room");
      setSession({ ...session, gameCreate: true });
    } else {
      socket.emit("joinGame", { room: session.room });
    }
  }

  // Render Components depending on session.choice value
  if(session.roomCreated === true) {
    return (
      <Redirect to={`/game?room=${session.room}&name=${session.name}`} />
    )
  } else {
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