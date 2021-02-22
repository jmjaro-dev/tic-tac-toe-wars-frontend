import { Link } from 'react-router-dom';

const Rematch = ({ msg, sender, response, onDecline, onConfirm, onLeave }) => {
  return (
    <div className="rematch">
      <p>{msg}</p> 

      {/* Show buttons only if not the sender of the request */}
      {!sender && response === "" && (
        <div className="btn-container">
          <button onClick={onDecline}>Decline</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      )} 

      {response === "declined" && (
        <Link to="/" onClick={onLeave}> Exit Room</Link>
      )}
    </div>
  )
}

export default Rematch;