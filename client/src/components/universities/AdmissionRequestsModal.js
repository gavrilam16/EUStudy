import React, { Component } from "react";

import { ADMISSION_STATUS } from "../../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getUniversities,
  modifyUniversity
} from "../../actions/universityActions";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { FaPencilAlt, FaPaperPlane } from "react-icons/fa";

class AdmissionRequestsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      comments: "",
      requestStatus: ""
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // On isModalOpen toggle
  toggle = () => {
    if (this.mounted) {
      this.setState({
        isModalOpen: !this.state.isModalOpen,
        comments: this.props.selectedAdmissionRequest.comments,
        requestStatus: this.props.selectedAdmissionRequest.requestStatus
      });
    }
  };

  // Get user input in state
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // When user clicks the Submit button
  handleSubmit = e => {
    e.preventDefault();

    // Copy selected university into a new object
    let university = Object.assign({}, this.props.selectedUniversity);
    university.id = this.props.selectedUniversity._id;
    // Find the index of the selected program
    const objIndexProgram = this.props.selectedUniversity.programs.findIndex(
      obj => obj._id === this.props.selectedProgram._id
    );
    const objIndexAdmissionRequest = university.programs[
      objIndexProgram
    ].admissionRequests.findIndex(
      obj => obj._id === this.props.selectedAdmissionRequest._id
    );
    // Modifiy request to the program in the university object
    university.programs[objIndexProgram].admissionRequests[
      objIndexAdmissionRequest
    ].requestStatus = this.state.requestStatus;

    university.programs[objIndexProgram].admissionRequests[
      objIndexAdmissionRequest
    ].comments = this.state.comments;

    // Send modify request via modifyUniversity action
    this.props.modifyUniversity(university);

    // Close modal
    this.toggle();
  };

  render() {
    return (
      <td>
        {/* Modal button */}
        <Button size="sm" href="#" onClick={this.toggle}>
          <FaPencilAlt /> Modify
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            {this.props.selectedUser[0]
              ? this.props.selectedUser[0].name
              : null}{" "}
            : {this.props.selectedProgram.name}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              {/* Admission status drop-down selector */}
              <FormGroup>
                <Label for="requestStatus">Status</Label>
                <Input
                  type="select"
                  name="requestStatus"
                  id="requestStatus"
                  bsSize="sm"
                  defaultValue={
                    this.props.selectedAdmissionRequest.requestStatus
                  }
                  onChange={e => this.handleChange(e)}
                >
                  {ADMISSION_STATUS.filter(status => status !== "Canceled").map(
                    (status, i) => (
                      <option key={i}>{status}</option>
                    )
                  )}
                </Input>
              </FormGroup>
              {/* Admission comments */}
              <FormGroup>
                <Label for="comments">Comments</Label>
                <Input
                  type="textarea"
                  name="comments"
                  id="comments"
                  rows="4"
                  defaultValue={this.props.selectedAdmissionRequest.comments}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>

              {/* Submit button */}
              <Button className="mb-3" color="dark" block>
                Submit <FaPaperPlane />
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </td>
    );
  }
}

// Set propTypes
AdmissionRequestsModal.propTypes = {
  getUniversities: PropTypes.func.isRequired,
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
  { getUniversities, modifyUniversity }
)(AdmissionRequestsModal);
