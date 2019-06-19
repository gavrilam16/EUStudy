import React, { Component } from "react";

import { ACADEMIC_DEGREES } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getUniversities } from "../../actions/universityActions";

import UniversityProgram from "./UniversityProgram";

import { Row, Col, Button, Input, InputGroup } from "reactstrap";

class UniversityProgramsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: this.props.countryCode,
      searchDomain: "",
      searchCourse: ""
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

  // When the program modal sends callback
  update = () => {
    this.setState({
      admissionSent: true
    });
  };

  // When user types in the search input
  handleSearchDomain = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSearchCourse = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // When user clicks the View All button
  handleViewAll = () => {
    this.setState({
      countryCode: undefined
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

    // Get domains arrays
    let bachelorsDomains = [];
    let mastersDomains = [];
    let PhdDomains = [];
    if (universities !== undefined) {
      // Get Bachelor's Degree domains from programs
      universities.map(university => {
        if (university.programs !== undefined)
          university.programs.map(program =>
            program.degree === ACADEMIC_DEGREES[0] ||
            program.degree === ACADEMIC_DEGREES[1]
              ? bachelorsDomains.push(program.domain)
              : null
          );
        return undefined;
      });
      // Keep just unique values and sort
      bachelorsDomains = [...new Set(bachelorsDomains)].sort();
      // Filter when the user is searching
      bachelorsDomains = bachelorsDomains.filter(
        domain =>
          domain
            .toLowerCase()
            .indexOf(this.state.searchDomain.toLowerCase()) !== -1
      );
      // Get Masters's Degree domains from programs
      universities.map(university => {
        if (university.programs !== undefined)
          university.programs.map(program =>
            program.degree === ACADEMIC_DEGREES[2] ||
            program.degree === ACADEMIC_DEGREES[3]
              ? mastersDomains.push(program.domain)
              : null
          );
        return undefined;
      });
      // Keep just unique values and sort
      mastersDomains = [...new Set(mastersDomains)].sort();
      // Filter when the user is searching
      mastersDomains = mastersDomains.filter(
        domain =>
          domain
            .toLowerCase()
            .indexOf(this.state.searchDomain.toLowerCase()) !== -1
      );
      // Get PhDs domains from programs
      universities.map(university => {
        if (university.programs !== undefined)
          university.programs.map(program =>
            program.degree === ACADEMIC_DEGREES[4]
              ? PhdDomains.push(program.domain)
              : null
          );
        return undefined;
      });
      // Keep just unique values and sort
      PhdDomains = [...new Set(PhdDomains)].sort();
      // Filter when the user is searching
      PhdDomains = PhdDomains.filter(
        domain =>
          domain
            .toLowerCase()
            .indexOf(this.state.searchDomain.toLowerCase()) !== -1
      );

      return (
        <Row id="universities-programs-panel">
          <Col md={{ size: 4, offset: 8 }}>
            {/* Search and View All */}
            <InputGroup className="mt-3">
              <Input
                className="mr-2"
                type="search"
                name="searchDomain"
                id="searchDomain"
                placeholder="Search by domain"
                onChange={e => this.handleSearchDomain(e)}
              />
              <Input
                type="search"
                name="searchCourse"
                id="searchCourse"
                placeholder="Search a program"
                onChange={e => this.handleSearchCourse(e)}
              />
              <Button onClick={this.handleViewAll} className="ml-2">
                View All
              </Button>
            </InputGroup>
          </Col>
          {/* Bachelor Degrees */}
          <Col md={6} className="mt-4">
            <h4 className="degree-title font-weight-bold">Bachelor's Degree</h4>
            {bachelorsDomains.map((domain, i) => (
              <div key={i}>
                {this.state.searchCourse === "" ? (
                  <h6 className="university-program-domain lead">{domain}</h6>
                ) : null}
                {universities
                  .filter(university => university.enabled)
                  .map((university, i) => (
                    <div key={i} md={4}>
                      {university.programs
                        .filter(program => program.domain === domain)
                        .filter(
                          program =>
                            program.name
                              .toLowerCase()
                              .indexOf(
                                this.state.searchCourse.toLowerCase()
                              ) !== -1
                        )
                        .map(program =>
                          program.degree === ACADEMIC_DEGREES[0] ||
                          program.degree === ACADEMIC_DEGREES[1] ? (
                            <UniversityProgram
                              key={program._id}
                              selectedUniversity={university}
                              selectedProgram={program}
                              showUniversity={true}
                              callBack={this.update}
                            />
                          ) : null
                        )}
                    </div>
                  ))}
              </div>
            ))}
          </Col>
          {/* Master's Degrees */}
          <Col md={6} className="mt-4">
            <h4 className="degree-title font-weight-bold">Master's Degree</h4>
            {mastersDomains.map((domain, i) => (
              <div key={i}>
                {this.state.searchCourse === "" ? (
                  <h6 className="university-program-domain lead">{domain}</h6>
                ) : null}
                {universities
                  .filter(university => university.enabled)
                  .map((university, i) => (
                    <div key={i} md={4}>
                      {university.programs
                        .filter(program => program.domain === domain)
                        .filter(
                          program =>
                            program.name
                              .toLowerCase()
                              .indexOf(
                                this.state.searchCourse.toLowerCase()
                              ) !== -1
                        )
                        .map(program =>
                          program.degree === ACADEMIC_DEGREES[2] ||
                          program.degree === ACADEMIC_DEGREES[3] ? (
                            <UniversityProgram
                              key={program._id}
                              selectedUniversity={university}
                              selectedProgram={program}
                              showUniversity={true}
                              callBack={this.update}
                            />
                          ) : null
                        )}
                    </div>
                  ))}
              </div>
            ))}
          </Col>
          {/* PhD's */}
          <Col md={6} className="mt-4">
            <h4 className="degree-title font-weight-bold">PhD</h4>
            {PhdDomains.map((domain, i) => (
              <div key={i}>
                {this.state.searchCourse === "" ? (
                  <h6 className="university-program-domain lead">{domain}</h6>
                ) : null}
                {universities
                  .filter(university => university.enabled)
                  .map((university, i) => (
                    <div key={i} md={4}>
                      {university.programs
                        .filter(program => program.domain === domain)
                        .filter(
                          program =>
                            program.name
                              .toLowerCase()
                              .indexOf(
                                this.state.searchCourse.toLowerCase()
                              ) !== -1
                        )
                        .map(program =>
                          program.degree === ACADEMIC_DEGREES[4] ? (
                            <UniversityProgram
                              key={program._id}
                              selectedUniversity={university}
                              selectedProgram={program}
                              showUniversity={true}
                              callBack={this.update}
                            />
                          ) : null
                        )}
                    </div>
                  ))}
              </div>
            ))}
          </Col>
        </Row>
      );
    }
  }
}

// Set propTypes
UniversityProgramsList.propTypes = {
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
)(UniversityProgramsList);
