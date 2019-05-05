import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../actions/userActions";

import RegisterModal from "./users/RegisterModal";
import LoginModal from "./users/LoginModal";
import AffiliateModal from "./universities/AffiliateModal";
import logo from "../static/images/logo.png";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  // Toggle for small devices
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  // When user clicks the Log Out button
  handleLogout = e => {
    e.preventDefault();

    this.props.logoutUser();
  };

  render() {
    // Check if user is authenticated
    if (this.props.user.isAuthenticated) {
      return (
        // If authenticated
        <Navbar color="dark" dark expand="md" fixed="top">
          <NavbarBrand href="/" className="p-0">
            <img id="header-logo" src={logo} alt="Logo" />
            <span id="header-title" className="ml-2">
              EU Study
            </span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <span id="welcome-message" className="navbar-text">
                Welcome,{" "}
              </span>
              <NavItem>
                <NavLink href="/profile/">
                  {this.props.user.currentUser.name}
                </NavLink>
              </NavItem>
              <NavItem>
                <AffiliateModal />
              </NavItem>
              <NavItem>
                <NavLink href="/" onClick={this.handleLogout}>
                  Log Out
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      );
    } else {
      return (
        // If unauthenticated
        <Navbar color="dark" dark expand="md" fixed="top">
          <NavbarBrand href="/" className="p-0">
            <img id="header-logo" src={logo} alt="Logo" />
            <span id="header-title" className="ml-2">
              EU Study
            </span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <LoginModal name="Affiliate" />
              </NavItem>
              <NavItem>
                <LoginModal name="Login" />
              </NavItem>
              <NavItem>
                <RegisterModal />
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      );
    }
  }
}

// Set propTypes
Map.propTypes = {
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
)(AppNavbar);
