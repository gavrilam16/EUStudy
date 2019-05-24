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

import moment from "moment";

class UniversityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      name: "",
      subscribedUntil: moment(
        this.props.selectedUniversity.subscribedUntil
      ).format(),
      THERanking: 0
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
      name: this.props.selectedUniversity.name,
      subscribedUntil: moment(
        this.props.selectedUniversity.subscribedUntil
      ).format(),
      THERanking: this.props.selectedUniversity.THERanking
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
      name: this.state.name,
      subscribedUntil: moment(this.state.subscribedUntil).format(),
      THERanking: this.state.THERanking
    };

    // Send modify request via modifyUniversity action
    this.props.modifyUniversity(university);

    this.toggle();
  };

  render() {
    return (
      <td>
        {/* Modal button */}
        <Button size="sm" onClick={this.toggle}>
          <FaPencilAlt /> Modify
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Modify</ModalHeader>
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
              {/* Subscribed until input*/}
              <FormGroup>
                <Label for="name">Subscribed Until</Label>
                <Input
                  type="date"
                  name="subscribedUntil"
                  id="subscribedUntil"
                  defaultValue={moment(this.state.subscribedUntil).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Times Higher Education Ranking input*/}
              <FormGroup>
                <Label for="THERanking">THE Ranking</Label>
                <Input
                  required
                  type="number"
                  name="THERanking"
                  id="THERanking"
                  defaultValue={this.state.THERanking}
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
UniversityModal.propTypes = {
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
)(UniversityModal);
