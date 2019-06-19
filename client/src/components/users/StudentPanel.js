import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUniversities,
  modifyUniversity
} from "../../actions/universityActions";
import { getUsers } from "../../actions/userActions";

import ConfirmModal from "./../ConfirmModal";

import { ADMISSION_STATUS } from "../../consts";

import { Row, Col, Spinner, Table } from "reactstrap";

import uuid from "uuid";

class StudentPanel extends Component {
  componentDidMount() {
    // Get universities from store via getUniversities action
    this.props.getUniversities();
    this.props.getUsers();
  }

  handleCancel = (selectedUniversity, selectedProgram, admissionRequest) => {
    // Copy selected university into a new object
    let university = Object.assign({}, selectedUniversity);
    university.id = selectedUniversity._id;
    // Find the index of the selected program
    const objIndex = selectedUniversity.programs.findIndex(
      obj => obj._id === selectedProgram._id
    );
    const objIndex2 = university.programs[objIndex].admissionRequests.findIndex(
      obj => obj._id === admissionRequest._id
    );
    // Modifiy request to the program in the university object
    university.programs[objIndex].admissionRequests[objIndex2].requestStatus =
      ADMISSION_STATUS[ADMISSION_STATUS.length - 1];

    console.log(university);
    // Send modify request via modifyUniversity action
    this.props.modifyUniversity(university);
  };

  render() {
    const { universities } = this.props.university;

    //Counter for list number
    let j = 1;

    // Show spinner if fetching from database
    if (this.props.isFetching) {
      return (
        <div className="text-center">
          <Spinner className="profile-spinner" color="info" />
        </div>
      );
    } else {
      return (
        <Row className="mt-5">
          <Col xs={12} md={{ size: 10, offset: 1 }}>
            <h6>
              In the table below you can follow that status of your{" "}
              <b>admission requests</b>. If you've changed your mind, you can
              also <b>try to cancel</b> your requests if still possible. If you
              have not yet applied for any program, you can do so from the{" "}
              <a href="/">main page</a>.
            </h6>
            <Table className="mt-5 text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Program</th>
                  <th>Admission Status</th>
                  <th>Comments</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              <tbody>
                {universities.map((university, i) =>
                  university.programs.map(program =>
                    program.admissionRequests.map(admissionRequest =>
                      admissionRequest.studentId ===
                      this.props.user.currentUser.id ? (
                        <tr key={i}>
                          <th scope="row">{j++}</th>
                          {/* Program */}
                          <td>{program.name}</td>
                          {/* Admission status */}
                          <td className="pb-0">
                            {admissionRequest.requestStatus}
                          </td>
                          {/* Admission comments */}
                          <td>{admissionRequest.comments}</td>
                            {admissionRequest.requestStatus ===
                              ADMISSION_STATUS[0] ? (
                              <ConfirmModal
                                key={uuid()}
                                tag="td"
                                buttonText="Cancel"
                                title="Cancel"
                                message={`Are you sure you want to cancel your admission request for ${
                                  program.name
                                }?`}
                                callBack={this.handleCancel.bind(
                                  this,
                                  university,
                                  program,
                                  admissionRequest
                                )}
                              />
                            ) : null}
                        </tr>
                      ) : null
                    )
                  )
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      );
    }
  }
}

// Set propTypes
StudentPanel.propTypes = {
  getUsers: PropTypes.func.isRequired,
  getUniversities: PropTypes.func.isRequired,
  modifyUniversity: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  university: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user,
  university: state.university,
  isFetching: state.university.isFetching
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUsers, getUniversities, modifyUniversity }
)(StudentPanel);
