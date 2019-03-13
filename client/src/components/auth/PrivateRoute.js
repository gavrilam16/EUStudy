import React from "react";
import { Route, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => (auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to="/login" />)}
  />
);

// Set propTypes
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  auth: state.auth
});

// Connect to store
export default connect(mapStateToProps)(PrivateRoute);
