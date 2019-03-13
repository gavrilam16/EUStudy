import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";

import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";

import classnames from "classnames";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If user is logged in navigates to Login, it should be redirected to Profile Page
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/profile");
    }
  }

  componentWillReceiveProps(nextProps) {
    // Get errors
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  // Get user input in state
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // When user clicks the Sign Up button
  handleSubmit = e => {
    e.preventDefault();

    // Get user input from state
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      role: "none"
    };

    // Send register request via registerUser action
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <Container className="mt-5 auth-container ">
        <Row>
          <Col>
            <h4 className="text-center">Register</h4>
            <Form onSubmit={this.handleSubmit}>
              {/* Name input */}
              <FormGroup>
                <Label for="name">Name *</Label>
                <Input
                  type="name"
                  name="name"
                  id="name"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                  placeholder="Enter name"
                  defaultValue={this.state.name}
                  error={errors.name}
                  onChange={e => this.handleChange(e)}
                />
                <span className="text-danger">{errors.name}</span>
              </FormGroup>
              <FormGroup>
                {/* Email input */}
                <Label for="email">Email *</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="username email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                  placeholder="Your email address"
                  defaultValue={this.state.email}
                  error={errors.email}
                  onChange={e => this.handleChange(e)}
                />
                <span className="text-danger">{errors.email}</span>
              </FormGroup>
              {/* Password input */}
              <FormGroup>
                <Label for="password">Password *</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                  placeholder="Your password"
                  onChange={e => this.handleChange(e)}
                />
                <span className="text-danger">{errors.password}</span>
              </FormGroup>
              <FormGroup>
                {/* Confirm password input */}
                <Label for="passwordConfirm">Confirm Password *</Label>
                <Input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  autoComplete="new-password"
                  className={classnames("", {
                    invalid: errors.passwordConfirm
                  })}
                  placeholder="Your password"
                  onChange={e => this.handleChange(e)}
                />
                <span className="text-danger">{errors.passwordConfirm}</span>
              </FormGroup>
              {/* Sign Up button */}
              <Button className="mb-3" color="dark" block>
                Sign Up
              </Button>
              {/* Link to login */}
              <p>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

// Set propTypes
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

// Connect to store
export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
