import { Fragment } from 'react';

export default () => {
  const styles = {
    position: "absolute",
    top: "40%",
    left: "50%"
  }

  return (
    <Fragment>
      <div className="preLoader" style={styles}>
        <h4>Loading...</h4>
      </div>
    </Fragment>
  )
}
