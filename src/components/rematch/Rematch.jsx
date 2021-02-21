import { Link } from 'react-router-dom';

const Rematch = ({ msg, sender, response, onDecline, onConfirm }) => {
  return (
    <div className="rematch">
      {/* Check If the player is the receiver */}
      {!sender && response === null && <h1>{msg}</h1>}
      
      {/* If player sent the rematch request */}
      {sender && response === null && <h1>Request sent. Waiting for Response...</h1>}

      {/* Check for Response */}
      {sender && response === "declined" &&  <h1>Rematch request declined.</h1>}

      {/* Show buttons only if not the sender of the request */}
      {!sender && response === null && (
        <>
          <button onClick={onDecline}>Decline</button>
          <button onClick={onConfirm}>Confirm</button>
        </>
      )} 

      {response === "declined" && (
        <Link to="/"> Exit Room</Link>
      )}
    </div>
  )
}

export default Rematch;