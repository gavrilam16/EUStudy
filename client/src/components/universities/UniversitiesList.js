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
  CardText,
  Input,
  InputGroup
} from "reactstrap";
import scrollToComponent from "react-scroll-to-component";

class UniversitiesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUniversity: {},
      countryCode: this.props.countryCode,
      search: ""
    };
  }

  componentDidMount() {
    // Get universities from store via getUniversities action
    this.props.getUniversities();
  }

  // Update country code when user clicks on map
  componentWillReceiveProps({ countryCode }) {
    this.setState({
      countryCode
    });
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

  // When user types in the search input
  handleSearch = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // When user clicks the View All button
  handleViewAll = () => {
    this.setState({
      countryCode: undefined
    });
  };

  render() {
    // Copy universities array from store
    let universities = JSON.parse(
      JSON.stringify(this.props.university.universities)
    );

    // Filter universities if a country is selected
    if (this.state.countryCode) {
      universities = universities.filter(
        university => university.countryCode === this.state.countryCode
      );
    }
    console.log(universities);
    // Filter universities on search
    universities = universities.filter(university => {
      if (university.name !== undefined) {
        return (
          university.name
            .toLowerCase()
            .indexOf(this.state.search.toLowerCase()) !== -1
        );
      } else {
        return null;
      }
    });

    return (
      <Row>
        <Col md={{ size: 3, offset: 9 }}>
          {/* Search and View All */}
          <InputGroup>
            <Input
              type="search"
              name="search"
              id="searchUniversity"
              placeholder="Search University"
              onChange={e => this.handleSearch(e)}
            />
            <Button onClick={this.handleViewAll} className="ml-2">
              View All
            </Button>
          </InputGroup>
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
          {/* University panel */}
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
  university: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  university: state.university,
  isFetching: state.university.isFetching
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUniversities }
)(UniversitiesList);
