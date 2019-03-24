import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import universityObject from "../../static/world_universities_and_domains.json";
import geographyObject from "../../static/world-10m.json";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/userActions";
import { addUniversity } from "../../actions/universityActions";

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

class Affiliate extends Component {
  constructor() {
    super();
    this.state = {
      selectedCountry: {
        properties: {}
      },
      selectedUniversity: {},
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If user is logged in navigates to Affiliate, it should be redirected to Profile Page
    if (this.props.user.isAuthenticated) {
      this.props.history.push("/profile");
    }
  }

  componentWillReceiveProps(nextProps) {
    // Get errors
    if (nextProps.error) {
      this.setState({
        errors: nextProps.error
      });
    }
  }

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

  // Get user input in state
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // When user clicks the Sign Up button
  handleSubmit = async e => {
    e.preventDefault();

    // Get user input from state
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      university: this.state.selectedUniversity.name,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
      role: "faculty"
    };

    // Send register request via registerUser action
    await this.props.registerUser(newUser, this.props.history);

    const { errors } = this.state;
    // Check if there were no errors adding the new user
    if (Object.keys(errors).length !== 0) {
      // Get university input from state
      const newUniversity = {
        name: this.state.selectedUniversity.name,
        countryCode: this.state.selectedUniversity.alpha_two_code,
        enabled: false
      };

      // Send add request via addUniversity action
      this.props.addUniversity(newUniversity);
    }
  };

  render() {
    const { errors } = this.state;

    return (
      <Container className="mt-5 auth-container ">
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              {/* Country drop-down selector*/}
              <FormGroup>
                <Input required
                  type="select"
                  name="selectCountry"
                  id="selectCountry"
                  defaultValue={this.state.selectedCountry.properties.name}
                  onChange={e => this.handleSelectCountry(e)}
                >
                  <option value="" hidden>
                    {" "}
                    Choose a country *{" "}
                  </option>
                  {geographyObject.objects.ne_10m_admin_0_countries.geometries.map(
                    ({ properties }) =>
                      // Display only countries with store data
                      properties.CONTINENT === "Europe" ? (
                        <option key={properties.ISO_A2}>
                          {properties.NAME}
                        </option>
                      ) : null
                  )}
                </Input>
              </FormGroup>
              {/* University drop-down selector*/}
              <FormGroup>
                <Input required
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
                    Choose an university *{" "}
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
                Send Request
              </Button>
              {/* Link to login */}
              <p>
                Already affiliated? <Link to="/login">Log in</Link>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

// Set propTypes
Affiliate.propTypes = {
  registerUser: PropTypes.func.isRequired,
  addUniversity: PropTypes.func.isRequired,
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
  { registerUser, addUniversity }
)(withRouter(Affiliate));
