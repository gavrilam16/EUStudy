import React, { Component } from "react";

import { POSITIONS } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { modifyUser } from "../../actions/userActions";

import universityObject from "../../static/world_universities_and_domains.json";
import geographyObject from "../../static/world-10m.json";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { FaPencilAlt, FaPaperPlane } from 'react-icons/fa';

import classnames from "classnames";

class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedCountry: {
        properties: {}
      },
      selectedUniversity: {},
      selectedPosition: {},
      name: "",
      email: "",
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

  // On isModalOpen toggle
  toggle = () => {
    if (this.mounted) {
      this.setState({
        isModalOpen: !this.state.isModalOpen,
        name: this.props.selectedUser.name,
        email: this.props.selectedUser.email
      });
    }
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
    if (e.target.value === "Admin") {
      this.setState({
        selectedPosition: {
            name: "admin",
            forScreen: "Admin"
        }
      });
    } else {
      const seekedPosition = e.target.value;
      // Search positions by name
      const foundPosition = POSITIONS.filter(
        e => seekedPosition === e.forScreen
      );
      // Set position as selectedPosition
      this.setState({
        selectedPosition: foundPosition[0]
      });
    }
  };

  // When user clicks the Submit button
  handleSubmit = e => {
    e.preventDefault();

    // Get user input from state
    const user = {
      id: this.props.selectedUser._id,
      name: this.state.name,
      email: this.state.email,
      university: this.state.selectedUniversity.name,
      role: this.state.selectedPosition.name
    };

    // Send modify request via modifyUser action
    this.props.modifyUser(user);

    // Close modal
    this.toggle();
  };

  render() {
    const { errors } = this.state;

    return (
      <td>
        {/* Modal button */}
        <Button size="sm" href="#" onClick={this.toggle}>
        <FaPencilAlt /> Modify
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Modifiy</ModalHeader>
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
              {/* Country drop-down selector*/}
              <FormGroup>
              <Label for="selectUniversity">University</Label>
                <Input
                  type="select"
                  name="selectCountry"
                  id="selectCountry"
                  defaultValue={this.state.selectedCountry.properties.name}
                  onChange={e => this.handleSelectCountry(e)}
                >
                  <option value="" hidden>
                    Choose a country
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
                  {this.props.user.currentUser.role === "admin" ? (
                    <option>Admin</option>
                  ) : null}
                </Input>
              </FormGroup>
              {/* Submit button */}
              <Button className="mb-3" color="dark" block>
              Submit < FaPaperPlane />
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </td>
    );
  }
}

// Set propTypes
UserModal.propTypes = {
  modifyUser: PropTypes.func.isRequired,
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
  { modifyUser }
)(UserModal);
