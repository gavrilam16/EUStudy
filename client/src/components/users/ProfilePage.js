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
      <Container>
        <Row className="mt-5">
          <Col>
            <h5>
              Hey there, {currentUser.name.split(" ")[0]}! You are logged in!
            </h5>
            <Button onClick={this.handleLogout}>Log Out</Button>
            {/* Show admin panel if admin */}
          </Col>
        </Row>
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
