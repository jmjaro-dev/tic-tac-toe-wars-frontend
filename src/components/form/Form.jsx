const Form = ({ choice, userName, room, onChange, onSubmit, goBack }) => {
  return (
    <form className="game-form" onSubmit={onSubmit}>
      <input type="text" name="userName" placeholder="Your Name here" onChange={onChange} value={userName} required />
      {choice === 2 && <input type="text" name="room" placeholder="Enter Room ID" className="input-room" onChange={onChange} value={room} required /> }
      
      <div className="btn-container">
        <button className="btn-back" type="button" onClick={goBack}>Back</button>
        <button className="btn-proceed" type="submit">{choice === 1 ? "Create" : "Join"}</button>
      </div>
    </form>
  )
}

export default Form;