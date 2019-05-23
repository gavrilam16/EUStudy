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

    // if (this.state.searchCourse) {
    //   universities = universities
    //     .filter(university =>
    //       university.programs.every(
    //         program => program.name === this.state.searchCourse
    //       )
    //     )
    //     // .map(university => {
    //     //   let newElt = Object.assign({}, university); // copies element
    //     //   return newElt.programs.filter(
    //     //     program => program.name === this.state.searchCourse
    //     //   );
    //     // });
    // }

    // Filter universities on search
    // universities = universities.map(university => {
    //   if (university !== undefined && university.programs !== undefined && university.programs.domain !== undefined) {
    //     university.programs.filter(
    //       program =>
    //         program.name
    //           .toLowerCase()
    //           .indexOf(this.state.searchCourse.toLowerCase()) !== -1
    //     );
    //   } else {
    //     return null;
    //   }
    // });

    // universities = universities.filter(university => {
    //   if (university.name !== undefined) {
    //     return (
    //       university.name
    //         .toLowerCase()
    //         .indexOf(this.state.search.toLowerCase()) !== -1
    //     );
    //   } else {
    //     return null;
    //   }
    // });

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
      bachelorsDomains = [...new Set(bachelorsDomains)].sort();
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
      mastersDomains = [...new Set(mastersDomains)].sort();
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
      PhdDomains = [...new Set(PhdDomains)].sort();

      return (
        <Row>
          <Col md={{ size: 3, offset: 9 }}>
            {/* Search and View All */}
            <InputGroup className="mt-3">
              <Input
                type="search"
                name="searchDomain"
                id="searchDomain"
                placeholder="Search Domain"
                onChange={e => this.handleSearchDomain(e)}
              />
              <Input
                type="search"
                name="searchCourse"
                id="searchCourse"
                placeholder="Search Course"
                onChange={e => this.handleSearchCourse(e)}
              />
              <Button onClick={this.handleViewAll} className="ml-2">
                View All
              </Button>
            </InputGroup>
          </Col>
          {/* Bachelor Degree's */}
          <Col md={4}>
            {"Bachelor's Degrees"}
            {bachelorsDomains.map((domain, i) => (
              <div key={i}>
                <h6 className="university-program-domain lead">{domain}</h6>
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
                              .indexOf(this.state.searchCourse.toLowerCase()) !== -1
                        )
                        .map(program =>
                          program.degree === ACADEMIC_DEGREES[0] ||
                          program.degree === ACADEMIC_DEGREES[1] ? (
                            <UniversityProgram
                              key={program._id}
                              selectedUniversity={university}
                              selectedProgram={program}
                              callBack={this.update}
                            />
                          ) : null
                        )}
                    </div>
                  ))}
              </div>
            ))}
          </Col>
          {/* Master's Degree's */}
          <Col md={4}>
            {"Master's Degrees"}
            {mastersDomains.map((domain, i) => (
              <div key={i}>
                <h6 className="university-program-domain lead">{domain}</h6>
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
                              .indexOf(this.state.searchCourse.toLowerCase()) !== -1
                        )
                        .map(program =>
                          program.degree === ACADEMIC_DEGREES[2] ||
                          program.degree === ACADEMIC_DEGREES[3] ? (
                            <UniversityProgram
                              key={program._id}
                              selectedUniversity={university}
                              selectedProgram={program}
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
