import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getScores } from '../../actions/scoreActions';
import PropTypes from 'prop-types';

const Leaderboard = ({ scores, loading, getScores }) => {
  useEffect(() => {
    getScores();
  }, [])
  return (
    <div className="leaderboard">
      <h1>Top 10 Leaderboard</h1>

      {loading ? (
        <h3>Getting Scores...</h3>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {scores && scores.sort((a, b) => b.score - a.score).map((score, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{score.username}</td>
                <td>{score.wins}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

Leaderboard.propTypes = {
  scores: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  getScores: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  scores: state.score.scores,
  loading: state.score.scoreLoading
});

export default connect(mapStateToProps, { getScores })(Leaderboard);
