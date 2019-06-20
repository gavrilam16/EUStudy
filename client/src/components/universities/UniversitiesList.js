import React, { Component } from "react";

import { EUR } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getUniversities } from "../../actions/universityActions";

import UniversityPanel from "./UniversityPanel";
import UniversityCardModal from "./UniversityCardModal";

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
import { FaExternalLinkAlt, FaUniversity } from "react-icons/fa";
import scrollToComponent from "react-scroll-to-component";

import moment from "moment";

class UniversitiesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUniversity: {},
      countryCode: this.props.countryCode,
      search: "",
      isTop10Enabled: false,
      isTop50Enabled: false
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

    // Scroll to UniversityPanel component
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

  // When user clicks the Top 10 button
  handleTop10 = () => {
    this.setState({
      isTop10Enabled: true,
      isTop50Enabled: false
    });
  };

  // When user clicks the Top 50 button
  handleTop50 = () => {
    this.setState({
      isTop10Enabled: false,
      isTop50Enabled: true
    });
  };

  // When user clicks the View All button
  handleViewAll = () => {
    this.setState({
      countryCode: "",
      isTop10Enabled: false,
      isTop50Enabled: false,
    });
    this.props.callBack();
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

    // Filter universities on Top 10
    if (this.state.isTop10Enabled) {
      universities = universities.filter(university => {
        if (university.name !== undefined) {
          return university.THERanking !== 0 && university.THERanking <= 10;
        } else {
          return null;
        }
      });
    }

    // Filter universities on Top 50
    if (this.state.isTop50Enabled) {
      universities = universities.filter(university => {
        if (university.name !== undefined) {
          return university.THERanking !== 0 && university.THERanking <= 50;
        } else {
          return null;
        }
      });
    }

    return (
      <Row id="universities-panel">
        <Col md={{ size: 4, offset: 8 }}>
          {/* Search, Tops and View All */}
          <InputGroup className="mt-3">
            <Input
              type="search"
              name="search"
              id="searchUniversity"
              placeholder="Search a university"
              onChange={e => this.handleSearch(e)}
            />
            <Button onClick={this.handleTop10} className="ml-2">
              Top 10
            </Button>
            <Button onClick={this.handleTop50} className="ml-2">
              Top 50
            </Button>
            <Button onClick={this.handleViewAll} className="ml-2">
              View All
            </Button>
          </InputGroup>
        </Col>
        {universities
          .filter(university => university.enabled)
          .map((university, i) => (
            <Col key={i} sm={12} md={3} className="mt-3">
              {/* University card */}
              <Card className="university-card">
                <CardHeader className="university-card-header">
                  <div className="university-card-left">
                    <span>
                      <FaUniversity /> {university.name}
                    </span>
                    <a
                      className="university-website d-block"
                      href={`${university.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      alt="university website"
                    >
                      {`${university.website}`
                        .replace(/^https?:\/\//i, "")
                        .replace(/\/$/, "")}{" "}
                      {<FaExternalLinkAlt />}
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
                    {university.motto ? (
                      <span className="d-block mb-1">
                        Motto: <i>{university.motto}</i>
                      </span>
                    ) : null}
                    {university.THERanking !== 0 ? (
                      <span className="d-block mb-1">
                        ET Ranking: <b>{university.THERanking}</b>
                      </span>
                    ) : null}
                    <span className="d-block">
                      First cycle fees: <b>{university.firstCycleFees}</b> {EUR}
                    </span>
                    <span className="d-block">
                      Second cycle fees: <b>{university.secondCycleFees}</b>{" "}
                      {EUR}
                    </span>
                    {university.admissionStartDate ? (
                      <span className="d-block">
                        Admission period:{" "}
                        <b>
                          {moment(university.admissionStartDate).format(
                            "MMMM Do YYYY"
                          )}
                        </b>{" "}
                        -{" "}
                        <b>
                          {moment(university.admissionEndDate).format(
                            "MMMM Do YYYY"
                          )}
                          .
                        </b>
                        {/* If admission period begins in less than 7 days */}
                        {moment(university.admissionStartDate).diff(
                          moment(),
                          "days"
                        ) <= 7 &&
                        moment(university.admissionStartDate).diff(
                          moment(),
                          "days"
                        ) > 0 ? (
                          <span className="d-block university-admission-period font-weight-bold">
                            Admission starts in{" "}
                            {moment(university.admissionStartDate).diff(
                              moment(),
                              "days"
                            )}{" "}
                            days.{" "}
                          </span>
                        ) : null}
                        {moment().isBetween(
                          moment(university.admissionStartDate),
                          moment(university.admissionEndDate)
                        ) ? (
                          <span className="d-block university-admission-period font-weight-bold">
                            The university is receiving admission requests.
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </CardText>
                  <div className="mt-4 d-inline">
                    {/* Learn More Button */}
                    <Button
                      color="info"
                      size="sm"
                      onClick={() => this.handleClick(university)}
                    >
                      Learn More
                    </Button>
                    {/* Modify Button */}
                    {this.props.user.currentUser.role === "admin" ||
                    (this.props.user.currentUser.role === "faculty" &&
                      this.props.user.currentUser.university ===
                        university.name) ? (
                      <UniversityCardModal selectedUniversity={university} />
                    ) : null}
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
  user: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  university: state.university,
  user: state.user,
  isFetching: state.university.isFetching
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUniversities }
)(UniversitiesList);
