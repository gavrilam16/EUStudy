import React, { Component } from "react";

import { EUR } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getUniversities } from "../../actions/universityActions";

import UniversityProgram from "./UniversityProgram";

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

class UniversityProgramsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryCode: this.props.countryCode,
      search: ""
    };
  }

  componentDidMount() {
    // Get universities from store via getUniversities action
    this.props.getUniversities();
  }

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

    // Get domains array
    let domains = [];
    if (universities !== undefined) {
      // Get domains from programs
      universities.map(university => {
        if(university.programs !== undefined)
        university.programs.map(program => domains.push(program.domain))
      }
      );
      domains = [...new Set(domains)].sort();

      return (
        <Row>
          <Col>
            {/* Search and View All */}
            <InputGroup className="mt-3">
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
          {/* {universities
          .filter(university => university.enabled)
          .map((university, i) => (
            domains.map((domain, i) => (
              <div key={i}>
                <h6 className="university-program-domain lead">{domain}</h6>
                {university.programs
                  // .filter(program => program.domain === domain)
                  .map(program => (
                    <UniversityProgram
                      key={program._id}
                      selectedUniversity={university}
                      selectedProgram={program}
                      callBack={this.update}
                    />
                  ))}
              </div>
            ))
          ))} */}
          {domains.map((domain, i) => (
            <div key={i}>
              <h6 className="university-program-domain lead">{domain}</h6>
              {universities
                .filter(university => university.enabled)
                .map((university, i) => (
                  <div key = {i}>
                  {university.programs
                    .filter(program => program.domain === domain)
                    .map(program => (
                      <UniversityProgram
                        key={program._id}
                        selectedUniversity={university}
                        selectedProgram={program}
                        callBack={this.update}
                      />
                    ))}
                    </div>
                ))}
            </div>
          ))}
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
