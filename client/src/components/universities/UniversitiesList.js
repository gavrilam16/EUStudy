import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getUniversities } from "../../actions/universityActions";

import {
  Row,
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
          .map(university => (
            // University card
            <Card className="university-card">
              <CardHeader>{university.name}</CardHeader>
              <CardBody>
                <CardTitle>Special Title Treatment</CardTitle>
                <CardText>{university.foundingYear}</CardText>
                <Button>Learn More</Button>
              </CardBody>
            </Card>
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
