const Form = ({ choice, name, room, onChange, goBack }) => {
  return (
    <form className="game-form" onSubmit={(e) => e.preventDefault()}>
      <input type="text" name="name" placeholder="Your Name here" onChange={onChange} value={name} />
      {choice === 2 && <input type="text" name="room" placeholder="Enter Room ID" className="input-room" onChange={onChange} value={room} /> }
      
      <div className="btn-container">
        <button className="btn-back" type="button" onClick={goBack}>Back</button>
        <button className="btn-proceed" type="button">{choice === 1 ? "Create" : "Join"}</button>
      </div>
    </form>
  )
}

export default Form;