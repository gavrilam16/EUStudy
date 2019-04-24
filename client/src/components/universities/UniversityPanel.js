import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getUniversities,
  modifyUniversity
} from "../../actions/universityActions";

import UniversityProgram from "./UniversityProgram";
import UniversityProgramModal from "./UniversityProgramModal";

import { Row, Col } from "reactstrap";

class UniversityPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUniversity: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedUniversity: nextProps.selectedUniversity
    });
  }

  // When the program modal sends callback after add or modify
  update = () => {
    let objIndex = this.props.university.universities.findIndex(
      obj => obj._id === this.props.selectedUniversity._id
    );
    this.setState({
      selectedUniversity: this.props.university.universities[objIndex]
    });
  };

  render() {
    if (this.state.selectedUniversity.programs !== undefined) {
      // Get domains from programs
      let domains = this.state.selectedUniversity.programs.map(
        program => program.domain
      );
      domains = [...new Set(domains)].sort();

      return (
        <Row id="university-panel">
          {/* Panel Header */}
          <Col md={12} id="university-panel-header" className="p-2">
            {this.state.selectedUniversity.name}
          </Col>
          {/* Panel Left Side */}
          <Col sm={12} md={6} id="university-panel-left">
            <div className="p-3">Details</div>
          </Col>
          {/* Panel Right Side */}
          <Col sm={12} md={6}>
            <div className="p-3">
              {this.props.user.currentUser.role === "admin" ||
              (this.props.user.currentUser.role === "faculty" &&
                this.props.user.currentUser.university ===
                  this.state.selectedUniversity.name) ? (
                <div className="text-right">
                  <UniversityProgramModal
                    selectedUniversity={this.state.selectedUniversity}
                    modify={false}
                    callBack={this.update}
                  />
                </div>
              ) : null}
              {domains.map((domain, i) => (
                <div key={i}>
                  <h6 className="university-program-domain lead">{domain}</h6>
                  {this.state.selectedUniversity.programs
                    .filter(program => program.domain === domain)
                    .map(program => (
                      <UniversityProgram
                        key={program._id}
                        selectedUniversity={this.state.selectedUniversity}
                        selectedProgram={program}
                        callBack={this.update}
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
                Select an university by pressing the <strong>Learn More</strong>{" "}
                button of one of the cards above. Choose another country from
                the map or click the <strong>View All</strong> button if no
                university card is available.
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
  getUniversities: PropTypes.func.isRequired,
  modifyUniversity: PropTypes.func.isRequired,
  university: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  university: state.university,
  user: state.user
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUniversities, modifyUniversity }
)(UniversityPanel);
