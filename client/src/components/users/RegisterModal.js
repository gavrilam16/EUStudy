import React, { Component } from "react";

import { POSITIONS } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/userActions";

import LoginModal from "./LoginModal";

import universityObject from "../../static/world_universities_and_domains.json";
import geographyObject from "../../static/world-10m.json";

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
class RegisterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedCountry: {
        properties: {}
      },
      selectedUniversity: {},
      selectedPosition: {},
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      errors: {}
    };
  }

  componentDidMount() {
    // Get errors
    this.mounted = true;

    if (this.props.error) {
      this.setState({
        errors: this.props.error
      });
    }
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
      modal: !this.state.modal,
      errors: {}
    });
  };

  // Get user input in state
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // When user selects a country from drop-down
  handleSelectCountry = e => {
    const seekedCountry = e.target.value;
    // Search country by name
    const foundCountry = geographyObject.objects.ne_10m_admin_0_countries.geometries.filter(
      e => seekedCountry === e.properties.NAME
    );
    // Set country as selectedCountry
    this.setState({
      selectedCountry: foundCountry[0]
    });
  };

  // When user selects an university from drop-down
  handleSelectUniversity = e => {
    const seekedUniversity = e.target.value;
    // Search university by name
    const foundUniversity = universityObject.filter(
      e => seekedUniversity === e.name
    );
    // Set university as selectedUniversity
    this.setState({
      selectedUniversity: foundUniversity[0]
    });
  };

  // When user selects a position from drop-down
  handleSelectPosition = e => {
    const seekedPosition = e.target.value;
    // Search positions by name
    const foundPosition = POSITIONS.filter(e => seekedPosition === e.forScreen);
    // Set position as selectedPosition
    this.setState({
      selectedPosition: foundPosition[0]
    });
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
      university: this.state.selectedUniversity.name,
      role: this.state.selectedPosition.name
    };

    // Send register request via registerUser action
    this.props.registerUser(newUser);

    this.mounted = false;
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="d-inline">
        {/* Modal button */}
        <NavLink href="#" onClick={this.toggle} className="d-inline">
          Sign Up
        </NavLink>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Sign Up</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              {/* Name input */}
              <FormGroup>
                <Label for="name">Name *</Label>
                <Input
                  type="text"
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
              {/* Confirm password input */}
              <FormGroup>
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
              {/* Country drop-down selector*/}
              <FormGroup>
                <Label for="selectUniversity">University</Label>
                <Input
                  type="select"
                  name="selectCountry"
                  id="selectCountryOfStudy"
                  defaultValue={this.state.selectedCountry.properties.name}
                  onChange={e => this.handleSelectCountry(e)}
                >
                  <option value="" hidden>
                    Choose a country
                  </option>
                  {geographyObject.objects.ne_10m_admin_0_countries.geometries.map(
                    ({ properties }) =>
                      // Display only countries from Europe having universities
                      (properties.CONTINENT === "Europe" &&
                      properties.ISO_A2 !== "AX" && // Except Aland Islands
                      properties.ISO_A2 !== "GI" && // Except Gibraltar
                      properties.ISO_A2 !== "GG" && // Except Guernsey
                      properties.ISO_A2 !== "IM" && // Except Isle of Man
                        properties.ISO_A2 !== "JE") || // Except Jersey
                      properties.ISO_A2 === "TR" || // Add Turkey
                      properties.ISO_A2 === "CY" ? ( // Add Cyprus
                        <option key={properties.ISO_A2}>
                          {properties.NAME}
                        </option>
                      ) : null
                  )}
                </Input>
              </FormGroup>
              {/* University drop-down selector*/}
              <FormGroup>
                <Input
                  type="select"
                  name="selectUniversity"
                  id="selectUniversity"
                  className={classnames("", {
                    invalid: errors.affiliated
                  })}
                  error={errors.affiliated}
                  defaultValue={this.state.selectedUniversity.name}
                  onChange={e => this.handleSelectUniversity(e)}
                >
                  <option value="" hidden>
                    {" "}
                    Choose an university{" "}
                  </option>
                  {universityObject.map((university, i) =>
                    // Display only countries with store data
                    university.alpha_two_code ===
                    this.state.selectedCountry.properties.ISO_A2 ? (
                      <option key={i}>{university.name}</option>
                    ) : null
                  )}
                </Input>
                <span className="text-danger">{errors.affiliated}</span>
              </FormGroup>
              {/* Position drop-down selector*/}
              <FormGroup>
                <Input
                  type="select"
                  name="selectPosition"
                  id="selectPosition"
                  defaultValue={this.state.selectedPosition.name}
                  onChange={e => this.handleSelectPosition(e)}
                >
                  <option value="" hidden>
                    {" "}
                    Select position{" "}
                  </option>
                  {POSITIONS.map((position, i) => (
                    <option key={i}>{position.forScreen}</option>
                  ))}
                </Input>
              </FormGroup>
              {/* Sign Up button */}
              <Button className="mb-3" color="dark" block>
                Sign Up
              </Button>
              {/* Open login modal */}
              Already have an account? <LoginModal name="Login" />
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

// Set propTypes
RegisterModal.propTypes = {
  registerUser: PropTypes.func.isRequired,
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
  { registerUser }
)(RegisterModal);
