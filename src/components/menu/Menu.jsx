const Menu = ({ onGameSelect }) => {
  return (
    <div className="game-menu">
      <button className="btn-create-game" onClick={e => onGameSelect(1)} >Create Game</button>
      <button className="btn-join-game" onClick={e => onGameSelect(2)} >Join Game</button>
    </div>
  )
}

export default Menu;