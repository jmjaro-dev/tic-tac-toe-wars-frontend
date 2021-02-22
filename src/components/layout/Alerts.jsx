import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const Alerts = ({ alerts }) => {
  return (
    alerts.length > 0 && alerts.map(alert => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        {alert.msg}
      </div>
    ))
  )
}

Alerts.propTypes = {
  alerts: PropTypes.array
}

const mapPropsToState = state => ({
  alerts: state.alert
});

export default connect(mapPropsToState, null)(Alerts);