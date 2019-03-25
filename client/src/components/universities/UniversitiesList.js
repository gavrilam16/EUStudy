import React, { Component } from "react";

import { EUR } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getUniversities } from "../../actions/universityActions";

import {
  Row,
  Col,
  Card,
  Button,
  CardHeader,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";

class UniversitiesList extends Component {
  componentDidMount() {
    // Get universities from store via getUniversities action
    this.props.getUniversities();
  }

  render() {
    let { universities } = this.props.university;

    // Filter by country if a country is selected
    if (this.props.countryCode) {
      universities = universities.filter(
        university => university.countryCode === this.props.countryCode
      );
    }

    return (
      <Row id="university-panel">
        {universities
          .filter(university => university.enabled)
          .map((university, i) => (
            <Col sm={12} md={3}>
            {/* University card */}
            <Card key={i} className="university-card">
              <CardHeader>
                <img
                  src={`https://www.countryflags.io/${
                    university.countryCode
                  }/flat/32.png`}
                  alt="country flag"
                />{" "}
                {university.name}
              </CardHeader>
              <CardBody>
                <CardTitle>
                  <a
                    href={`${university.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    alt="university website"
                  >
                    {`${university.website}`
                      .replace(/^https?:\/\//i, "")
                      .replace(/\/$/, "")}
                  </a>
                </CardTitle>
                <CardText>
                  <span className="d-block">
                    First cycle: <b>{university.firstCycleFees}</b> {EUR}
                  </span>
                  <span className="d-block">
                    Second cycle: <b>{university.secondCycleFees}</b> {EUR}
                  </span>
                </CardText>
                <Button color="info" size="sm">Learn More</Button>
              </CardBody>
            </Card>
            </Col>
          ))}
      </Row>
    );
  }
}

// Set propTypes
UniversitiesList.propTypes = {
  getUniversities: PropTypes.func.isRequired,
  university: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  university: state.university
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUniversities }
)(UniversitiesList);
