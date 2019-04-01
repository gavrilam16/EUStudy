import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { modifyUniversity } from "../../actions/universityActions";

import UniversityCourse from "./UniversityCourse";

import { Row, Col } from "reactstrap";

class UniversityPanel extends Component {
  render() {
    const { selectedUniversity } = this.props;

    if (selectedUniversity.programs !== undefined) {
      // Get domains from programs
      let domains = selectedUniversity.programs.map(program => program.domain);
      domains = [...new Set(domains)].sort();

      return (
        <Row id="university-panel">
          <Col md={12} id="university-panel-header" className="p-2">
            {selectedUniversity.name}
          </Col>
          <Col sm={12} md={6}>
            <div className="p-3">Details</div>
          </Col>
          <Col sm={12} md={6}>
            <div className="p-3">
              {domains.map((domain, i) => (
                <div key={i}>
                  <h5>{domain}</h5>
                  {selectedUniversity.programs
                    .filter(program => program.domain === domain)
                    .map(program => (
                      <UniversityCourse
                        key={program._id}
                        selectedProgram={program}
                      />
                    ))}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      );
      // If no university is selected
    } else {
      return (
        <Row id="university-panel">
          <Col md={12} id="university-panel-header" className="p-2">
            Choose an university
          </Col>
          <Col>
            <div className="p-3">
              <p>
                Select an university by pressing the <strong>Learn More</strong> button of one of the cards above. Choose another country from
                the map or click the <strong>View All</strong> button if no university card is available.
              </p>
            </div>
          </Col>
        </Row>
      );
    }
  }
}

// Set propTypes
UniversityPanel.propTypes = {
  modifyUniversity: PropTypes.func.isRequired,
  university: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  university: state.university
});

// Connect to store
export default connect(
  mapStateToProps,
  { modifyUniversity }
)(UniversityPanel);
