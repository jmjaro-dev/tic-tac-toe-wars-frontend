const Menu = ({ onGameSelect }) => {
  return (
    <div className="game-menu">
      <button className="btn-create-game" onClick={() => onGameSelect('create')} >Create Game</button>
      <button className="btn-join-game" onClick={() => onGameSelect('join')} >Join Game</button>
    </div>
  )
}

export default Menu;