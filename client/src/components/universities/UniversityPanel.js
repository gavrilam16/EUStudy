import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { modifyUniversity } from "../../actions/universityActions";

import { Row, Col } from "reactstrap";

class UniversityPanel extends Component {

  render() {
    return (
      <Row>
        <Col><h4>{this.props.selectedUniversity.name}</h4></Col>
      </Row>
    );
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
