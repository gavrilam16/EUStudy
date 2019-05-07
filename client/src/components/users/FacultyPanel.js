import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUniversities,
  modifyUniversity
} from "../../actions/universityActions";
import { getUsers } from "../../actions/userActions";

import { SUBSCRIPTIONS, EUR, ADMISSION_STATUS } from "../../consts";

import {
  Row,
  Col,
  Button,
  Spinner,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Table,
  FormGroup,
  Input
} from "reactstrap";
import { FaPaperPlane, FaUniversity } from "react-icons/fa";

import moment from "moment";

class FacultyPanel extends Component {
  constructor() {
    super();
    this.state = {
      extended: false
    };
  }

  componentDidMount() {
    // Get universities from store via getUniversities action
    this.props.getUniversities();
    this.props.getUsers();
  }

  handleClick = (e, subscribedUniversity) => {
    // Extend the subcription period
    let university = {};
    // If university is enabled extend the period from the subscribed until date
    if (subscribedUniversity.enabled) {
      university = {
        id: subscribedUniversity._id,
        subscribedUntil: moment(subscribedUniversity.subscribedUntil)
          .add(e.target.name, "months")
          .calendar()
      };
      // If university is not enabled extend the period from today
    } else {
      university = {
        id: subscribedUniversity._id,
        subscribedUntil: moment()
          .add(e.target.name, "months")
          .calendar()
      };
    }

    // Mark university as extended
    this.setState({
      extended: true
    });

    // Send modifiy request via modifiyUniversity action
    this.props.modifyUniversity(university);
  };

  handleChangeStatus = (
    e,
    selectedUniversity,
    selectedProgram,
    admissionRequest
  ) => {
    // Copy selected university into a new object
    let university = Object.assign({}, selectedUniversity);
    university.id = selectedUniversity._id;
    // Find the index of the selected program
    const objIndex = selectedUniversity.programs.findIndex(
      obj => obj._id === selectedProgram._id
    );
    const objIndex2 = university.programs[objIndex].admissionRequests.findIndex(
      obj => obj._id === admissionRequest._id
    );
    // Modifiy request to the program in the university object
    university.programs[objIndex].admissionRequests[objIndex2].requestStatus =
      e.target.value;

    // Send modify request via modifyUniversity action
    this.props.modifyUniversity(university);
  };

  render() {
    const { universities } = this.props.university;
    const { users } = this.props.user;

    //Counter for list number
    let j = 1;

    // Show spinner if fetching from database
    if (this.props.isFetching) {
      return (
        <div className="text-center">
          <Spinner className="profile-spinner" color="info" />
        </div>
      );
    } else {
      return (
        <Row className="mt-5">
          {/* University subcription */}
          <Col xs={12} md={{ size: 10, offset: 1 }}>
            {universities.map((university, i) =>
              university.name === this.props.user.currentUser.university ? (
                // If the university is enabled
                university.enabled ? (
                  <div key={i}>
                    <p>
                      The {university.name} <FaUniversity /> is currently{" "}
                      <b>visible</b> in the the universities list and its
                      subscription end date is{" "}
                      <b>
                        {moment(university.subscribedUntil).format(
                          "MMMM Do YYYY, h:mm A"
                        )}
                      </b>
                      . Extend the subscription period by choosing one of the
                      following options:
                    </p>
                    <div id="subscription-panel-faculty" className="mb-1">
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
                              onClick={e => this.handleClick(e, university)}
                            >
                              Send <FaPaperPlane />
                            </Button>
                          </CardBody>
                        </Card>
                      ))}
                      {/* Sent message */}
                    </div>
                    {this.state.extended ? (
                      <p className="mt-3">
                        {" "}
                        The subscription period has been extended. You are
                        required to make the payment in 15 days.
                      </p>
                    ) : null}
                  </div>
                ) : (
                  // If the university is not enabled
                  <div key={i}>
                    <p>
                      The {university.name} is currently <b>not visible</b> in
                      the universities list and it's subscription end date is{" "}
                      <b>
                        {moment(university.subscribedUntil).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </b>
                      . Extend the subscription period by choosing one of the
                      following options:
                    </p>
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
                              onClick={e => this.handleClick(e, university)}
                            >
                              Send <FaPaperPlane />
                            </Button>
                          </CardBody>
                        </Card>
                      ))}
                      {/* Sent message */}
                    </div>
                    {this.state.extended ? (
                      <p className="mt-3">
                        {" "}
                        A request has been sent to the page administrators. You
                        will recieve a response by email in the next hours.
                      </p>
                    ) : null}
                  </div>
                )
              ) : null
            )}
          </Col>
          {/* Admission requests */}
          <Col xs={12} md={{ size: 10, offset: 1 }}>
            <Table className="mt-3 text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Program</th>
                  <th>Admission Status</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {universities.map((university, i) =>
                  university.programs.map(program =>
                    program.admissionRequests.map(admissionRequest =>
                      university.name ===
                      this.props.user.currentUser.university ? (
                        <tr key={i}>
                          <th scope="row">{j++}</th>
                          {/* User name */}
                          <td>
                            {users.map(user =>
                              user._id === admissionRequest.studentId
                                ? user.name
                                : null
                            )}
                          </td>
                          {/* User email */}
                          <td>
                            {users.map(user =>
                              user._id === admissionRequest.studentId
                                ? user.email
                                : null
                            )}
                          </td>
                          {/* Program */}
                          <td>{program.name}</td>
                          {/* Admission status */}
                          <td>{admissionRequest.requestStatus}</td>
                          {/* Change status */}
                          <td className="pb-0">
                            <FormGroup>
                              <Input
                                type="select"
                                name="requestStatus"
                                id="selectAdmissionStatus"
                                bsSize="sm"
                                onChange={e =>
                                  this.handleChangeStatus(
                                    e,
                                    university,
                                    program,
                                    admissionRequest
                                  )
                                }
                              >
                                <option value="" hidden>
                                  {" "}
                                  Choose a status{" "}
                                </option>
                                {ADMISSION_STATUS.filter(
                                  status =>
                                    status !== "Canceled" && status !== "Sent"
                                ).map((status, i) => (
                                  <option key={i}>{status}</option>
                                ))}
                              </Input>
                            </FormGroup>
                          </td>
                        </tr>
                      ) : null
                    )
                  )
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      );
    }
  }
}

// Set propTypes
FacultyPanel.propTypes = {
  getUsers: PropTypes.func.isRequired,
  getUniversities: PropTypes.func.isRequired,
  modifyUniversity: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  university: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user,
  university: state.university,
  isFetching: state.university.isFetching
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUsers, getUniversities, modifyUniversity }
)(FacultyPanel);
