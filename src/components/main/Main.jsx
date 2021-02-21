import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
// Component
import Menu from '../menu/Menu';
import Form from '../form/Form';

const Main = ({ socket }) => {
  const initialState = {
    choice: 0,
    userName: '',
    room: '',
    roomCreated: false,
    gameCreate: false,
    joinConfirmed: false
  };

  const [session, setSession] = useState(initialState);
  
  useEffect(() => {
    if(socket !== "" && session.gameCreate) {
      socket.on("roomCreated", ({ room, name }) => {
        setSession({ ...session, room, userName: name, roomCreated: true });
      });
    }

    if(socket !== "" && !session.joinConfirmed) {
      socket.on("joinConfirmed", ({ room, name }) => {
        setSession({ ...session, room, userName: name, joinConfirmed: true });
      });
    }
  }, [socket, session]); 

  // Updates the values of 'session' state
  const onChange = e => {
    setSession({ ...session, [e.target.name]: e.target.value });
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
      socket.emit("createGame", session.userName);
    } else {
      socket.emit("joinGame", { room: session.room, name: session.userName });
    }
  }

  // Check if room is already Created by server
  if(session.roomCreated || session.joinConfirmed) {
    return (
      <Redirect to={`/game?room=${session.room}&name=${session.userName}`} />
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