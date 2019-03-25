import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginUser } from "../../actions/userActions";

import RegisterModal from "./RegisterModal";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  NavLink,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import classnames from "classnames";

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    // Get errors
    if (nextProps.error) {
      this.setState({
        errors: nextProps.error
      });
    }
  }

  // On modal toggle
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

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

    this.toggle();
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="d-inline">
        {/* Modal button -- Text from parent component */}
        <NavLink href="#" onClick={this.toggle} className="d-inline">
          {this.props.name}
        </NavLink>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Login</ModalHeader>
          <ModalBody>
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
              {/* Open register modal */}
              Don't have an account? <RegisterModal />
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

// Set propTypes
LoginModal.propTypes = {
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
)(LoginModal);
