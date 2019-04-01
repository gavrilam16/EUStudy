import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { modifyUniversity } from "../../actions/universityActions";

import { Button } from "reactstrap";

class UniversityCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingDetails: false
    };
  }

  handleDetails = () => {
    this.setState({
      isShowingDetails: !this.state.isShowingDetails
    });
  };

  render() {
    const { selectedProgram } = this.props;

    return (
      <div>
        <h6 className="d-inline">
          {selectedProgram.name}, {selectedProgram.degree}
        </h6>
        <Button
          outline
          color="info"
          size="sm"
          onClick={this.handleDetails}
          className="ml-2"
        >
          {this.state.isShowingDetails ? "-" : "+"}
        </Button>
        <div style={this.state.isShowingDetails ? {} : { display: "none" }}>
          <p>{selectedProgram.fees}</p>
        </div>
      </div>
    );
  }
}

// Set propTypes
UniversityCourse.propTypes = {
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
)(UniversityCourse);
