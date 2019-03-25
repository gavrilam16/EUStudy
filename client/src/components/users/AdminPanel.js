import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUsers, deleteUser } from "../../actions/userActions";
import {
  getUniversities,
  modifyUniversity,
  deleteUniversity
} from "../../actions/universityActions";

import UserModal from "./UserModal";
import UniversityModal from "./../universities/UniversityModal";
import ConfirmModal from "./../ConfirmModal";

import { Row, Col, Button, Table, Spinner, FormGroup, CustomInput } from "reactstrap";
import uuid from "uuid";

class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      selectedData: "users"
    };
  }

  componentDidMount() {
    // Get users from store via getUsers action
    this.props.getUsers();
    this.props.getUniversities();
  }

  // When user clicks one of the select data buttons
  handleClick = e => {
    this.setState({
      selectedData: e.target.name
    });
  };

  handleChange = async e => {
    const university = {
      id: e.target.id,
      enabled: e.target.checked
    };

    await this.props.modifyUniversity(university);
    this.props.getUniversities();
  };

  // When the user modal sends callback after modify
  updateUser = async () => {
    // Get the updated array of users
    await this.props.getUsers();
  };

  // When the university modal sends callback after modify
  updateUniversity = async () => {
    // Get the updated array of universities
    await this.props.getUniversities();
  };

  // When the confirm modal sends callback
  handleDeleteUser = async id => {
    // Delete user from database via deleteUser action
    await this.props.deleteUser(id);
    // Get the updated array of users
    await this.props.getUsers();
  };

  // When the confirm modal sends callback
  handleDeleteUniversity = async id => {
    // Delete university from database via deleteUniversity action
    await this.props.deleteUniversity(id);
    // Get the updated array of universities
    await this.props.getUniversities();
  };

  render() {
    const { users } = this.props.user;
    const { universities } = this.props.university;

    //Counter for list number
    let i = 1;
    // Set rules for showing data
    const showData = !this.props.university.isFetching ? (
      // Show users data if Users is selected
      this.state.selectedData === "users" ? (
        <Table className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>University</th>
              <th>Role</th>
              <th colSpan="2">Manage</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={uuid()}>
                <th scope="row">{i++}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.university}</td>
                <td>{user.role}</td>
                <UserModal
                  key={uuid()}
                  selectedUser={user}
                  callBack={this.updateUser}
                />
                <ConfirmModal
                  key={uuid()}
                  tag="td"
                  buttonText="Delete"
                  title="Delete"
                  message={`Are you sure you want to delete the data for ${
                    user.name
                  }?`}
                  callBack={this.handleDeleteUser.bind(this, user._id)}
                />
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        // Show universities data if Universities is selected
        <Table className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Founding Year</th>
              <th>Website</th>
              <th>Description</th>
              <th>First Cycle Fees</th>
              <th>Second Cycle Fees</th>
              <th>Enabled</th>
              <th colSpan="2">Manage</th>
            </tr>
          </thead>
          <tbody>
            {universities.map(university => (
              <tr key={university._id}>
                <th scope="row">{i++}</th>
                <td>{university.name}</td>
                <td>{university.foundingYear}</td>
                <td>{university.website}</td>
                <td>{university.description}</td>
                <td>{university.firstCycleFees}</td>
                <td>{university.secondCycleFees}</td>
                <td>
                  <FormGroup>
                    <CustomInput
                      type="switch"
                      id={university._id}
                      defaultChecked={university.enabled}
                      onChange={e => this.handleChange(e)}
                    />
                  </FormGroup>
                </td>
                <UniversityModal
                  key={uuid()}
                  tag="td"
                  selectedUniversity={university}
                  callBack={this.updateUniversity}
                />
                <ConfirmModal
                  key={uuid()}
                  tag="td"
                  buttonText="Delete"
                  title="Delete"
                  message={`Are you sure you want to delete the data for ${
                    university.name
                  }?`}
                  callBack={this.handleDeleteUniversity.bind(
                    this,
                    university._id
                  )}
                />
              </tr>
            ))}
          </tbody>
        </Table>
      )
    ) : (
      <Spinner color="info" />
    );

    // Show spinner if fetching from database
    if (this.props.isFetching) {
      return <Spinner color="info" />;
    } else {
      return (
        <Row className="mt-5">
          <Col>
            <Button name="users" onClick={e => this.handleClick(e)}>
              Users
            </Button>
            <Button
              name="universities"
              className="ml-2"
              onClick={e => this.handleClick(e)}
            >
              Universities
            </Button>
            {showData}
          </Col>
        </Row>
      );
    }
  }
}

// Set propTypes
AdminPanel.propTypes = {
  getUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  getUniversities: PropTypes.func.isRequired,
  modifyUniversity: PropTypes.func.isRequired,
  deleteUniversity: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  university: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user,
  university: state.university,
  isFetching: state.user.isFetching
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUsers, deleteUser, getUniversities, modifyUniversity, deleteUniversity }
)(AdminPanel);
