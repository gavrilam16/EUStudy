import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import { Container, Row, Col, Button } from "reactstrap";

class ProfilePage extends Component {
  // When user clicks the Log Out button
  handleLogout = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    return (
      <Container>
        <Row className="mt-5">
          <Col>
            <h5>Hey there, {user.name.split(" ")[0]}! You are logged in!</h5>
            <Button onClick={this.handleLogout}>Log Out</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

// Set propTypes
ProfilePage.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  auth: state.auth
});

// Connect to store
export default connect(
  mapStateToProps,
  { logoutUser }
)(ProfilePage);
