import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { modifyUniversity } from "../../actions/universityActions";

import { ACADEMIC_DEGREES } from "../../consts";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import { FaPencilAlt, FaPaperPlane } from "react-icons/fa";

class UniversityProgramModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      name: "",
      link: "",
      domain: "",
      degree: "",
      fees: 0,
      duration: "",
      ECTS: 0,
      description: ""
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
      // If marked as modify get program data from parent
      if (this.props.modify) {
        this.setState({
          name: this.props.selectedProgram.name,
          link: this.props.selectedProgram.link,
          domain: this.props.selectedProgram.domain,
          degree: this.props.selectedProgram.degree,
          fees: this.props.selectedProgram.fees,
          ECTS: this.props.selectedProgram.ECTS,
          duration: this.props.selectedProgram.duration,
          description: this.props.selectedProgram.description,
          isModalOpen: !this.state.isModalOpen
        });
        // If not marked as modify, set placeholders to display on adding
      } else {
        this.setState({
          name: "",
          link: "",
          domain: "",
          degree: "",
          fees: 0,
          duration: "",
          ECTS: 0,
          description: "",
          isModalOpen: !this.state.isModalOpen
        });
      }
    }
  };

  // Get user input in state
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // When user clicks the Submit button
  handleSubmit = e => {
    e.preventDefault();

    // Get university program input from state
    let university = {};
    // If modifying program
    if (this.props.modify) {
      // Copy selected university into a new object
      university = {
        id: this.props.selectedUniversity._id,
        programs: [...this.props.selectedUniversity.programs]
      };
      // Find the index of the selected program
      const objIndex = university.programs.findIndex(
        obj => obj._id === this.props.selectedProgram._id
      );
      // Add new program to the university object
      university.programs[objIndex] = {
        name: this.state.name,
        link: this.state.link,
        domain: this.state.domain,
        degree: this.state.degree,
        fees: this.state.fees,
        duration: this.state.duration,
        ECTS: this.state.ECTS,
        description: this.state.description
      };
      // If adding new program
    } else {
      university = {
        id: this.props.selectedUniversity._id,
        programs: [
          ...this.props.selectedUniversity.programs,
          {
            name: this.state.name,
            link: this.state.link,
            domain: this.state.domain,
            degree: this.state.degree,
            fees: this.state.fees,
            duration: this.state.duration,
            ECTS: this.state.ECTS,
            description: this.state.description
          }
        ]
      };
    }

    // Send modify request via modifyUniversity action
    this.props.modifyUniversity(university);

    // Refresh UniversityPanel after 1 second
    setTimeout(() => this.props.callBack(), 1000);

    // Close modal
    this.toggle();
  };

  render() {
    // Set modal button text
    const buttonText = this.props.modify ? "Modify" : "Add Program";

    return (
      <div className="d-inline">
        {/* Modal button */}
        <Button size="sm" onClick={this.toggle}>
          <FaPencilAlt /> {buttonText}
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            {this.props.modify
              ? "Modify " + this.props.selectedProgram.name
              : "Add Program"}{" "}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              {/* Name input*/}
              <FormGroup>
                <Label for="name">Name *</Label>
                <Input
                  required
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={this.state.name}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Link input*/}
              <FormGroup>
                <Label for="name">Link *</Label>
                <Input
                  required
                  type="text"
                  name="link"
                  id="link"
                  defaultValue={this.state.link}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Domain input*/}
              <FormGroup>
                <Label for="name">Domain *</Label>
                <Input
                  required
                  type="text"
                  name="domain"
                  id="domain"
                  defaultValue={this.state.domain}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Degree input*/}
              <FormGroup>
                <Label for="name">Degree *</Label>
                <Input
                  type="select"
                  name="degree"
                  id="degree"
                  defaultValue={this.state.degree}
                  onChange={e => this.handleChange(e)}
                >
                  <option value="" hidden>
                    {" "}
                    Choose degree{" "}
                  </option>
                  {ACADEMIC_DEGREES.map((status, i) => (
                    <option key={i}>{status}</option>
                  ))}
                </Input>
              </FormGroup>
              {/* Duration input*/}
              <FormGroup>
                <Label for="duration">Duration</Label>
                <Input
                  type="text"
                  name="duration"
                  id="duration"
                  defaultValue={this.state.duration}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Fees input*/}
              <FormGroup>
                <Label for="name">Fees *</Label>
                <Input
                  required
                  type="number"
                  name="fees"
                  id="fees"
                  min="0"
                  defaultValue={this.state.fees}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* ECTS input*/}
              <FormGroup>
                <Label for="ects">ECTS</Label>
                <Input
                  type="number"
                  name="ECTS"
                  id="ECTS"
                  min="0"
                  defaultValue={this.state.ECTS}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Description input*/}
              <FormGroup>
                <Label for="name">Description *</Label>
                <Input
                  required
                  type="textarea"
                  rows="4"
                  name="description"
                  id="description"
                  defaultValue={this.state.description}
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
      </div>
    );
  }
}

// Set propTypes
UniversityProgramModal.propTypes = {
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
)(UniversityProgramModal);
