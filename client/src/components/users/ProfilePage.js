import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/userActions";

import { Container, Row, Col, Button } from "reactstrap";

import AdminPanel from "./AdminPanel";

class ProfilePage extends Component {
  // When user clicks the Log Out button
  handleLogout = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { currentUser } = this.props.user;
    // Set rule for showing the admin panel
    const showAdminPanel = currentUser.role === "admin" ? <AdminPanel /> : null;
    return (
      <Container className="container-fluid">
        <Row id="profile-panel">
          <Col>
            <h5>Hey there, {currentUser.name.split(" ")[0]}!</h5>
            <Button color="primary" onClick={this.handleLogout}>Log Out</Button>
          </Col>
        </Row>
        {/* Show admin panel if admin */}
        {showAdminPanel}
      </Container>
    );
  }
}

// Set propTypes
ProfilePage.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user
});

// Connect to store
export default connect(
  mapStateToProps,
  { logoutUser }
)(ProfilePage);
