import { Link } from 'react-router-dom';

const Wait = ({ room }) => {

  // Copies the Room id when user clicks on Textbox
  const onFocus = e => {
    const target = e.target;
    
    target.select();
    target.setSelectionRange(0, 99999);

    document.execCommand("copy");
  }

  // Copies the Room id when user clicks on Copy button
  const onClick = _ => {
    const textbox = document.getElementById("room-invite-id");

    textbox.select();
    textbox.setSelectionRange(0, 99999);

    document.execCommand("copy");
  }

  return (
    <div className="wait-info">
      <h1>Waiting for other player to join</h1>
      <label htmlFor="roomID">Give this Room ID to your friend for them to join</label>
      <input type="text" name="roomID" id="room-invite-id" value={room} onFocus={onFocus} readOnly />
      <button onClick={onClick}>Copy</button>
      <Link to="/"> Exit Room</Link>
    </div>
  )
}

export default Wait;