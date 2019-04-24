import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { modifyUniversity } from "../../actions/universityActions";

import UniversityProgramModal from "./UniversityProgramModal";
import ConfirmModal from "./../ConfirmModal";

import { EUR } from "../../consts";

import { Button } from "reactstrap";
import { FaMinus, FaPlus, FaExternalLinkAlt } from "react-icons/fa";

import uuid from "uuid";

class UniversityProgram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingDetails: false
    };
  }

  // When user clicks the +/- button
  handleDetails = () => {
    this.setState({
      isShowingDetails: !this.state.isShowingDetails
    });
  };

  // When the confirm modal sends callback
  handleDelete = id => {
    // Remove the selected program from the programs array
    const university = {
      id: this.props.selectedUniversity._id,
      programs: [...this.props.selectedUniversity.programs]
    };
    let objIndex = university.programs.findIndex(obj => obj._id === id);
    university.programs.splice(objIndex, 1);

    // Send modify request via modifyUniversity action
    this.props.modifyUniversity(university);

    // Refresh UniversityPanel after 1 second
    setTimeout(() => this.props.callBack(), 1000);
  };

  update = () => {
    // Send callback to UniversityPanel
    this.props.callBack();
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
          {this.state.isShowingDetails ? <FaMinus /> : <FaPlus />}
        </Button>
        <div
          className="university-program"
          style={this.state.isShowingDetails ? {} : { display: "none" }}
        >
          <p>{selectedProgram.description}</p>
          <p>
            Fees: <b>{selectedProgram.fees}</b> {EUR}
          </p>
          <a
            className="d-block mb-2"
            href={selectedProgram.link}
            target="_blank"
            rel="noopener noreferrer"
            alt="program website"
          >
            Click to visit program page <FaExternalLinkAlt />
          </a>
          {this.props.user.currentUser.role === "admin" ||
          (this.props.user.currentUser.role === "faculty" &&
            this.props.user.currentUser.university ===
              this.props.selectedUniversity.name) ? (
            <div className="d-inline">
              {/* Modify Button */}
              <UniversityProgramModal
                selectedUniversity={this.props.selectedUniversity}
                selectedProgram={selectedProgram}
                modify={true}
                callBack={this.update}
              />
              {/* Delete Button */}
              <ConfirmModal
                key={uuid()}
                tag="div"
                inline={true}
                buttonText="Delete"
                title="Delete"
                message={`Are you sure you want to delete the data for ${
                  selectedProgram.name
                }?`}
                isSecondButton={true}
                callBack={this.handleDelete.bind(this, selectedProgram._id)}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

// Set propTypes
UniversityProgram.propTypes = {
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
  { modifyUniversity }
)(UniversityProgram);
