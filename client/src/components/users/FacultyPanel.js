import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUniversities,
  modifyUniversity
} from "../../actions/universityActions";

import { SUBSCRIPTIONS, EUR } from "../../consts";

import {
  Row,
  Col,
  Button,
  Spinner,
  Card,
  CardBody,
  CardText,
  CardTitle
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

  render() {
    const { universities } = this.props.university;

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
          <Col xs={12} md={{ size: 10, offset: 1 }}>
            {universities.map((university, i) =>
              university.name === this.props.user.currentUser.university ? (
                // If the university is enabled
                university.enabled ? (
                  <div key={i}>
                    <p>
                      The {university.name} <FaUniversity /> is currently{" "}
                      <b>visible</b> in the the universities list and it's
                      subscription end date is{" "}
                      <b>
                        {moment(university.subscribedUntil).format(
                          "MMMM Do YYYY, h:mm A"
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
        </Row>
      );
    }
  }
}

// Set propTypes
FacultyPanel.propTypes = {
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
  { getUniversities, modifyUniversity }
)(FacultyPanel);
