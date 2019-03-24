import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loginUser } from "../../actions/userActions";

import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import classnames from "classnames";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If user is logged in navigates to Login, it should be redirected to Profile Page
    if (this.props.user.isAuthenticated) {
      this.props.history.push("/profile");
    }
  }

  componentWillReceiveProps(nextProps) {
    // If user has just logged in, it shoud be redirected to the root page
    if (nextProps.user.isAuthenticated) {
      this.props.history.push("/");
    }

    // Get errors
    if (nextProps.error) {
      this.setState({
        errors: nextProps.error
      });
    }
  }

  // Get user input in state
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // When user clicks the Log In button
  handleSubmit = e => {
    e.preventDefault();

    // Get user input from state
    const userInput = {
      email: this.state.email,
      password: this.state.password
    };

    // Send login request via loginUser action
    this.props.loginUser(userInput);
  };

  render() {
    const { errors } = this.state;

    return (
      <Container className="mt-5 auth-container">
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              {/* Email input */}
              <FormGroup>
                <Label for="email">Email *</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="username email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailNotFound
                  })}
                  placeholder="Your email address"
                  defaultValue={this.state.email}
                  error={errors.email}
                  onChange={e => this.handleChange(e)}
                />
                <span className="text-danger">
                  {errors.email}
                  {errors.emailNotFound}
                </span>
              </FormGroup>
              {/* Password input */}
              <FormGroup>
                <Label for="password">Password *</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  className={classnames("", {
                    invalid: errors.password || errors.incorrectPassword
                  })}
                  placeholder="Your password"
                  onChange={e => this.handleChange(e)}
                />
                <span className="text-danger">
                  {errors.password}
                  {errors.incorrectPassword}
                </span>
              </FormGroup>
              {/* Log In button */}
              <Button className="mb-3" color="dark" block>
                Log In
              </Button>
              {/* Link to register */}
              <p>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

// Set propTypes
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user,
  error: state.error
});

// Connect to store
export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
