import React, { Component } from "react";

import universityObject from "../../static/world_universities_and_domains.json";
import geographyObject from "../../static/world-10m.json";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { modifyUniversity } from "../../actions/universityActions";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input
} from "reactstrap";

import classnames from "classnames";

class UniversityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selectedCountry: {
        properties: {}
      },
      selectedUniversity: {},
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

  // When user clicks the Log In button
  handleSubmit = e => {
    e.preventDefault();

    // Get university input from state
    const newUniversity = {
      name: this.state.selectedUniversity.name,
      countryCode: this.state.selectedUniversity.alpha_two_code,
      website: this.state.selectedUniversity.web_pages[0],
      enabled: false
    };

    // Send add request via addUniversity action
    this.props.addUniversity(newUniversity);

    this.toggle();

  };

  render() {
    const { errors } = this.state;
    const Tag = this.props.tag;

    return (
      <Tag>
        {/* Modal button */}
        <Button href="#" color="info" onClick={this.toggle}>
          Edit
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Edit</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              {/* Country drop-down selector*/}
              <FormGroup>
                <Input
                  required
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
                <Input
                  required
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
              {/* Sign Up button */}
              <Button className="mb-3" color="dark" block>
                Send Request
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </Tag>
    );
  }
}

// Set propTypes
UniversityModal.propTypes = {
  modifyUniversity: PropTypes.func.isRequired,
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
  { modifyUniversity }
)(UniversityModal);
