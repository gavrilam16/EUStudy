import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { modifyUniversity } from "../../actions/universityActions";

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

class UniversityCardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      website: "",
      address: "",
      foundingYear: 0,
      motto: "",
      description: "",
      firstCycleFees: 0,
      secondCycleFees: 0
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
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      website: this.props.selectedUniversity.website,
      address: this.props.selectedUniversity.address,
      foundingYear: this.props.selectedUniversity.foundingYear,
      motto: this.props.selectedUniversity.motto,
      description: this.props.selectedUniversity.description,
      firstCycleFees: this.props.selectedUniversity.firstCycleFees,
      secondCycleFees: this.props.selectedUniversity.secondCycleFees
    });
  };

  // Get user input in state
  handleChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // When user clicks the Submit button
  handleSubmit = e => {
    e.preventDefault();

    // Get university input from state
    const university = {
      id: this.props.selectedUniversity._id,
      website: this.state.website,
      address: this.state.address,
      foundingYear: this.state.foundingYear,
      motto: this.state.motto,
      description: this.state.description,
      firstCycleFees: this.state.firstCycleFees,
      secondCycleFees: this.state.secondCycleFees
    };

    // Send modify request via modifyUniversity action
    this.props.modifyUniversity(university);

    // Close modal
    this.toggle();
  };

  render() {
    return (
      <div className="d-inline">
        {/* Modal button */}
        <Button onClick={this.toggle} size="sm" className="ml-1">
          <FaPencilAlt /> Modify
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Modify {this.props.selectedUniversity.name}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              {/* Website input*/}
              <FormGroup>
                <Label for="website">Website *</Label>
                <Input
                  required
                  type="text"
                  name="website"
                  id="website"
                  defaultValue={this.state.website}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Address input*/}
              <FormGroup>
                <Label for="motto">Address *</Label>
                <Input
                  required
                  type="text"
                  name="address"
                  id="address"
                  defaultValue={this.state.address}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Founding Year input*/}
              <FormGroup>
                <Label for="foundingYear">Founding Year *</Label>
                <Input
                  required
                  type="number"
                  name="foundingYear"
                  id="foundingYear"
                  min="0"
                  defaultValue={this.state.foundingYear}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Motto input*/}
              <FormGroup>
                <Label for="motto">Motto</Label>
                <Input
                  type="text"
                  name="motto"
                  id="motto"
                  defaultValue={this.state.motto}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Description input*/}
              <FormGroup>
                <Label for="motto">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  defaultValue={this.state.description}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* First cycle fees input*/}
              <FormGroup>
                <Label for="firstCycleFees">First Cycle Fees</Label>
                <Input
                  type="number"
                  name="firstCycleFees"
                  id="firstCycleFees"
                  min="0"
                  defaultValue={this.state.firstCycleFees}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Second cycle fees input*/}
              <FormGroup>
                <Label for="secondCycleFees">Second Cycle Fees</Label>
                <Input
                  type="number"
                  name="secondCycleFees"
                  id="secondCycleFees"
                  min="0"
                  defaultValue={this.state.secondCycleFees}
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
UniversityCardModal.propTypes = {
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
)(UniversityCardModal);
