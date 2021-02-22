import Score from '../score/Score';

const GameScore = ({ playersData }) => {

  return (
    <div className='score-board'>
        <h2>Score Board</h2>
        <hr/>
        <div className="scores-container">
          <Score username={playersData[0].username} wins={playersData[0].wins}/>
          <Score username={playersData[1].username} wins={playersData[1].wins}/>
        </div>
    </div>
  )
}

export default GameScore;