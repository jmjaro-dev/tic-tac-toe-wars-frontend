const Score = ({ username, wins }) => {
  return (
    <div className="score">
      <p className="player-name">{username}</p>
      <p>{wins}</p>
    </div>
  )
}

export default Score
