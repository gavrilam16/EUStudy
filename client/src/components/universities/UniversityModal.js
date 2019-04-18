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

import moment from "moment";

class UniversityModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      subscribedUntil: moment(this.props.selectedUniversity.subscribedUntil).format()
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // On modal toggle
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      name: this.props.selectedUniversity.name,
      subscribedUntil: moment(this.props.selectedUniversity.subscribedUntil).format()
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
      subscribedUntil: moment(this.state.subscribedUntil).format()
    };

    // Send add request via addUniversity action
    this.props.modifyUniversity(university);

    this.toggle();
  };

  render() {

    return (
      <td>
        {/* Modal button */}
        <Button href="#" color="info" onClick={this.toggle}>
          Modify
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
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
                  defaultValue={moment(this.state.subscribedUntil).format('YYYY-MM-DD')}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Submit button */}
              <Button className="mb-3" color="dark" block>
                Send Request
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
  user: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user,
  error: state.error
});

// Connect to store
export default connect(
  mapStateToProps,
  { modifyUniversity }
)(UniversityModal);
