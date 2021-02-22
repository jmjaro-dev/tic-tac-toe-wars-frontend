const Form = ({ choice, room, onChange, onSubmit, goBack }) => {
  return (
    <form className="game-form" onSubmit={onSubmit}>
      {choice === 'join' && <input type="text" name="room" placeholder="Enter Room ID" className="input-room" onChange={onChange} value={room} required /> }
      
      <div className="btn-container">
        <button className="btn-back" type="button" onClick={goBack}>Back</button>
        <button className="btn-proceed" type="submit">Join</button>
      </div>
    </form>
  )
}

export default Form;