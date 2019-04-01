import React, { Component } from "react";

import { EUR } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getUniversities } from "../../actions/universityActions";

import UniversityPanel from "./UniversityPanel";

import {
  Row,
  Col,
  Card,
  Button,
  CardHeader,
  CardBody,
  CardText
} from "reactstrap";
import scrollToComponent from "react-scroll-to-component";

class UniversitiesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUniversity: {},
      countryCode: this.props.countryCode
    };
  }

  componentDidMount() {
    // Get universities from store via getUniversities action
    this.props.getUniversities();
  }

  componentWillReceiveProps({countryCode}) {
    this.setState({
      countryCode: countryCode
    })
  }

  // Set selected university when user clicks on a Learn More button
  handleClick = university => {
    this.setState({
      selectedUniversity: university
    });

    // Scroll to University Panel component
    scrollToComponent(this.University, {
      offset: 0,
      align: "middle",
      duration: 250
    });
  };

  handleViewAll = () => {
    this.setState({
      countryCode: undefined
    })
  }

  render() {
    let { universities } = this.props.university;

    // Filter by country if a country is selected
    if (this.state.countryCode) {
      universities = universities.filter(
        university => university.countryCode === this.state.countryCode
      );
    }

    return (
      <Row>
        <Col md={{ size: 1, offset: 11 }}>
          <Button onClick={this.handleViewAll}>View All</Button>
        </Col>
        {universities
          .filter(university => university.enabled)
          .map((university, i) => (
            <Col key={i} sm={12} md={3}>
              {/* University card */}
              <Card className="university-card">
                <CardHeader className="university-card-header">
                  <div className="university-card-left">
                    <span>{university.name}</span>
                    <a
                      className="university-website d-block"
                      href={`${university.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      alt="university website"
                    >
                      {`${university.website}`
                        .replace(/^https?:\/\//i, "")
                        .replace(/\/$/, "")}
                    </a>
                  </div>
                  <div className="university-card-right">
                    <img
                      src={`https://www.countryflags.io/${
                        university.countryCode
                      }/flat/32.png`}
                      alt="country flag"
                    />
                  </div>
                </CardHeader>
                <CardBody>
                  <CardText>
                    <span className="d-block">
                      First cycle: <b>{university.firstCycleFees}</b> {EUR}
                    </span>
                    <span className="d-block">
                      Second cycle: <b>{university.secondCycleFees}</b> {EUR}
                    </span>
                  </CardText>
                  <div className="mt-4 text-center">
                    <Button
                      color="info"
                      onClick={() => this.handleClick(university)}
                    >
                      Learn More
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        <Col md={12}>
          <section
            ref={section => {
              this.University = section;
            }}
          >
            <UniversityPanel
              selectedUniversity={this.state.selectedUniversity}
            />
          </section>
        </Col>
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
