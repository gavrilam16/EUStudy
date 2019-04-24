import React, { Component } from "react";

import { SUBSCRIPTIONS, EUR } from "../../consts";

import universityObject from "../../static/world_universities_and_domains.json";
import geographyObject from "../../static/world-10m.json";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addUniversity } from "../../actions/universityActions";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  NavLink,
  Form,
  FormGroup,
  Input,
  Card,
  CardText,
  CardBody,
  CardTitle
} from "reactstrap";
import { FaPaperPlane } from "react-icons/fa";

import classnames from "classnames";
import moment from "moment";

class AffiliateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isSent: false,
      selectedCountry: {
        properties: {}
      },
      selectedUniversity: {
        web_pages: []
      },
      errors: {}
    };
  }

  componentDidMount() {
    this.mounted = true;

    if (this.props.error) {
      this.setState({
        errors: this.props.error
      });
    }

    universityObject.map(university => {
      if (university.name === this.props.user.currentUser.university) {
        this.setState({
          selectedUniversity: university
        });
      }
      return university;
    });
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
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      isSent: false,
      errors: {}
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
      subscribedUntil: moment()
        .add(e.target.name, "months")
        .calendar(),
      enabled: false
    };

    // Send add request via addUniversity action
    this.props.addUniversity(newUniversity);

    if (
      Object.entries(this.state.errors).length === 0 &&
      this.state.errors.constructor === Object
    ) {
      this.setState({
        isSent: true
      });
    }
  };

  render() {
    const { errors } = this.state;
    // Set rules for the message showing after pressing the Send button
    const showSentMessage =
      Object.entries(errors).length === 0 &&
      errors.constructor === Object &&
      this.state.isSent ? (
        this.props.user.currentUser.role === "admin" ? (
          <p>Affiliation request sent.</p>
        ) : (
          <p>
            An affiliation request has been sent to the page administrators. You
            will recieve a response by email in the next hours.
          </p>
        )
      ) : (
        <span className="text-danger">{errors.affiliated}</span>
      );

    // If user is admin
    if (this.props.user.currentUser.role === "admin") {
      return (
        <div className="d-inline">
          {/* Modal button */}
          <NavLink href="#" onClick={this.toggle}>
            Affiliate
          </NavLink>
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Affiliate {this.state.selectedUniversity.name}</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.handleSubmit}>
                {/* Country drop-down selector*/}
                <FormGroup>
                  <Input
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
                </FormGroup>
                {/* Send Request button */}
                <div id="subscription-panel" className="mb-1">
                  {SUBSCRIPTIONS.map((subscription, i) => (
                    <Card key={i} className="ml-3 mr-3 text-center">
                      <CardBody>
                        <CardTitle>
                          <h5>{subscription.forScreen}</h5>
                        </CardTitle>
                        <CardText className="subscription-price">
                          {subscription.price} {EUR}
                        </CardText>
                        {/* Send button */}
                        <Button
                          size="sm"
                          color="info"
                          id={subscription.id}
                          name={subscription.months}
                          onClick={e => this.handleSubmit(e)}
                        >
                          Send <FaPaperPlane />
                        </Button>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                {/* Sent message */}
                <div className="mt-2">{showSentMessage}</div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      );
      // If user is faculty
    } else if (this.props.user.currentUser.role === "faculty") {
      return (
        <div className="d-inline">
          {/* Modal button */}
          <NavLink href="#" onClick={this.toggle}>
            Affiliate
          </NavLink>
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Affiliate</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.handleSubmit}>
                <div>
                  You can affiliate the following institution:{" "}
                  <p className="font-weight-bold">
                    {this.props.user.currentUser.university}
                  </p>
                </div>
                <p className="lead">Choose a payment plan:</p>
                <div id="subscription-panel" className="mb-1">
                  {SUBSCRIPTIONS.map((subscription, i) => (
                    <Card key={i} className="ml-3 mr-3 text-center">
                      <CardBody>
                        <CardTitle>
                          <h5>{subscription.forScreen}</h5>
                        </CardTitle>
                        <CardText className="subscription-price">
                          {subscription.price} {EUR}
                        </CardText>
                        {/* Send button */}
                        <Button
                          size="sm"
                          color="info"
                          id={subscription.id}
                          name={subscription.months}
                          onClick={e => this.handleSubmit(e)}
                        >
                          Send <FaPaperPlane />
                        </Button>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                {/* Sent message */}
                <div className="mt-2">{showSentMessage}</div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      );
      // If user is not admin or faculty
    } else {
      return (
        <div className="d-inline">
          {/* Modal button */}
          <NavLink href="#" onClick={this.toggle}>
            Affiliate
          </NavLink>
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
            <ModalHeader toggle={this.toggle}>Affiliate</ModalHeader>
            <ModalBody>
              <div className="m-3 lead">
                You must be a faculty member in order to affiliate an
                university.
              </div>
            </ModalBody>
          </Modal>
        </div>
      );
    }
  }
}

// Set propTypes
AffiliateModal.propTypes = {
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
  { addUniversity }
)(AffiliateModal);
