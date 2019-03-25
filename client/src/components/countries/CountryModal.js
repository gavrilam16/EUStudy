import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addCountry, modifyCountry } from "../../actions/countryActions";

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

class CountryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      name: this.props.selectedCountry.NAME,
      euMember: "",
      firstCycleFees: "",
      secondCycleFees: "",
      payingFees: "",
      needBasedGrants: "",
      meritBasedGrants: "",
      receivingGrants: ""
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
      // If marked as modify get country data from parent
      if (this.props.modify) {
        this.setState({
          euMember: this.props.selectedCountry.euMember,
          firstCycleFees: this.props.selectedCountry.firstCycleFees,
          secondCycleFees: this.props.selectedCountry.secondCycleFees,
          payingFees: this.props.selectedCountry.payingFees,
          needBasedGrants: this.props.selectedCountry.needBasedGrants,
          meritBasedGrants: this.props.selectedCountry.meritBasedGrants,
          receivingGrants: this.props.selectedCountry.receivingGrants,
          isModalOpen: !this.state.isModalOpen
        });
        // If not marked as modify, set placeholders to display on adding
      } else {
        this.setState({
          euMember: false,
          firstCycleFees: 0,
          secondCycleFees: 0,
          payingFees: "",
          needBasedGrants: 0,
          meritBasedGrants: 0,
          receivingGrants: "",
          isModalOpen: !this.state.isModalOpen
        });
      }
    }
  };

  // Get user input in state
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // Get user input in state -- for EU Member checkbox
  handleClick = e => {
    this.setState({
      euMember: e.target.checked
    });
  };

  // When user clicks the Submit button
  handleSubmit = async e => {
    e.preventDefault();

    const country = {
      id: this.props.selectedCountry._id,
      name: this.props.selectedCountry.NAME,
      euMember: this.state.euMember,
      firstCycleFees: this.state.firstCycleFees,
      secondCycleFees: this.state.secondCycleFees,
      payingFees: this.state.payingFees,
      needBasedGrants: this.state.needBasedGrants,
      meritBasedGrants: this.state.meritBasedGrants,
      receivingGrants: this.state.receivingGrants
    };

    // Add country via addCountry action
    if (this.props.modify) {
      await this.props.modifyCountry(country);
    } else {
      await this.props.addCountry(country);
    }

    // Refresh CountryInfo
    this.props.callBack();

    // Close modal
    this.toggle();
  };

  render() {
    // Set isModalOpen button text
    const buttonText = this.props.modify ? "Edit" : "Add";
    return (
      <div className="d-inline">
        {/* Modal button */}
        <Button color="info" onClick={this.toggle}>
          {buttonText}
        </Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggle}>
          {/* Modal Title */}
          <ModalHeader toggle={this.toggle}>
            Add data about {this.props.selectedCountry.NAME}
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              {/* EU Member input */}
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="euMember"
                    defaultChecked={this.state.euMember}
                    onClick={e => this.handleClick(e)}
                  />{" "}
                  EU Member State
                </Label>
              </FormGroup>
              {/* First cycle input */}
              <FormGroup>
                <Label for="first-cycle-fees">First Cycle Fees</Label>
                <Input
                  type="number"
                  name="firstCycleFees"
                  id="first-cycle-fees"
                  placeholder="Add first cicle fees"
                  defaultValue={this.state.firstCycleFees}
                  min="0"
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Second cycle input */}
              <FormGroup>
                <Label for="second-cycle-fees">Second Cycle Fees</Label>
                <Input
                  type="number"
                  name="secondCycleFees"
                  id="second-cycle-fees"
                  placeholder="Add second cycle fees"
                  defaultValue={this.state.secondCycleFees}
                  min="0"
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Paying fees input */}
              <FormGroup>
                <Label for="paying-fees">Paying Fees Info</Label>
                <Input
                  type="text"
                  name="payingFees"
                  id="paying-fees"
                  placeholder="Add info about how many students are paying fees"
                  defaultValue={this.state.payingFees}
                  maxLength="100"
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Need-based grants input */}
              <FormGroup>
                <Label for="need-based-grants">Need-based Grants</Label>
                <Input
                  type="number"
                  name="needBasedGrants"
                  id="need-based-grants"
                  placeholder="Add need based grants"
                  defaultValue={this.state.needBasedGrants}
                  min="0"
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Merit-based grants input */}
              <FormGroup>
                <Label for="merit-based-grants">Merit-based grants</Label>
                <Input
                  type="number"
                  name="meritBasedGrants"
                  id="merit-based-grants"
                  placeholder="Add merit based grants"
                  defaultValue={this.state.meritBasedGrants}
                  min="0"
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Receiving grants input */}
              <FormGroup>
                <Label for="receiving-grants">Receiving Grants Info</Label>
                <Input
                  type="text"
                  name="receivingGrants"
                  id="receiving-grants"
                  placeholder="Add info about how many students are receving grants"
                  defaultValue={this.state.receivingGrants}
                  maxLength="100"
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
              {/* Submit button */}
              <Button color="dark" block>
                Submit
              </Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

// Set propTypes
CountryModal.propTypes = {
  addCountry: PropTypes.func.isRequired,
  modifyCountry: PropTypes.func.isRequired,
  country: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  country: state.country
});

// Connect to store
export default connect(
  mapStateToProps,
  { addCountry, modifyCountry }
)(CountryModal);
