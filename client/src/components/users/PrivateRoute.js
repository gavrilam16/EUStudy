import React from "react";
import { Route, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

// Set propTypes
PrivateRoute.propTypes = {
  user: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user
});

// Connect to store
export default connect(mapStateToProps)(PrivateRoute);
