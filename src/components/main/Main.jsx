import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Component
import Menu from '../menu/Menu';
import Form from '../form/Form';

const Main = ({ user, socket }) => {
  const initialState = {
    choice: null,
    room: '',
    roomCreated: false,
    gameCreate: false,
    joinConfirmed: false
  };

  const [session, setSession] = useState(initialState);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    if(socket && session.gameCreate && isMounted) {
      socket.on("roomCreated", (room) => {
        onRoomCreated(room);
      });
    }

    if(socket && !session.joinConfirmed && isMounted) {
      socket.on("joinConfirmed", (room) => {
        onJoinConfirmed(room);
      });
    }

    return () => {
      socket.offAny();
      setIsMounted(false)
      if(session.choice === "create") {
        setSession(initialState);
      }
    }
  }, [socket, session]); 

  // When room is Created
  const onRoomCreated = (room) => {
    setSession({ ...session, room, roomCreated: true });
  }

  // On Join Confirmed
  const onJoinConfirmed = (room) => {
    if(isMounted) setSession({ ...session, room, joinConfirmed: true });
  }

  // Updates the value of 'room' state
  const onChange = e => {
    setSession({ ...session, room: e.target.value });
  }

  // Resets the state
  const goBack = _ => {
    setSession(initialState);
  }

  // Sets 'session.choice' state to either 1 (new game) or 2 (join game)
  const onGameSelect = choice => {
    setSession({ ...session, choice }); 
    
    if(choice === 'create') {
      setSession({ ...session, gameCreate: true });
      socket.emit("createGame", user.username);
    }
  }

  const onSubmit = e => {
    e.preventDefault();
    const room = session.room;
    setSession({ ...session, gameCreate: false })
    socket.emit("joinGame", room);
  }

  // Check if room is already Created by server
  if(session.roomCreated || session.joinConfirmed) {
    return (
      <Redirect to={`/game/${session.room}`} />
    )
  } else {
    // Render Components depending on session.choice value
    if(session.choice === 'join') {
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

Main.propTypes = {
  user: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired 
}

const mapStateToProps = state => ({
  user: state.auth.user,
  socket: state.auth.socket
});

export default connect(mapStateToProps, { })(Main);