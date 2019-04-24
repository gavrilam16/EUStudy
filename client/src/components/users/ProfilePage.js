import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/userActions";

import { Container, Row, Col, Button } from "reactstrap";

import AdminPanel from "./AdminPanel";
import { FaSignOutAlt } from "react-icons/fa";

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
          <Col xs={12} md={{ size: 10, offset: 1 }}>
            <h5>Hey there, {currentUser.name.split(" ")[0]}!</h5>
            <Button color="dark" size="sm" onClick={this.handleLogout}>
              Log Out <FaSignOutAlt />{" "}
            </Button>
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
