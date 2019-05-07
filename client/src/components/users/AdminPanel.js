import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUsers, modifyUser, deleteUser } from "../../actions/userActions";
import {
  getUniversities,
  modifyUniversity,
  deleteUniversity
} from "../../actions/universityActions";

import UserModal from "./UserModal";
import UniversityModal from "./../universities/UniversityModal";
import ConfirmModal from "./../ConfirmModal";

import {
  Row,
  Col,
  Button,
  Table,
  Spinner,
  FormGroup,
  CustomInput
} from "reactstrap";
import { FaUserGraduate, FaUniversity } from "react-icons/fa";

import uuid from "uuid";
import moment from "moment";

class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      selectedData: "users"
    };
  }

  componentDidMount() {
    // Get users and universities from store via getUsers and getUniversities actions
    this.props.getUsers();
    this.props.getUniversities();
  }

  // When user clicks one of the select data buttons
  handleClick = e => {
    this.setState({
      selectedData: e.target.name
    });
  };

  handleChange = e => {
    const university = {
      id: e.target.id,
      enabled: e.target.checked
    };

    this.props.modifyUniversity(university);
  };

  // When the confirm modal sends callback
  handleDeleteUser = id => {
    // Delete user from database via deleteUser action
    this.props.deleteUser(id);
  };

  // When the confirm modal sends callback
  handleDeleteUniversity = id => {
    // Delete university from database via deleteUniversity action
    this.props.deleteUniversity(id);
  };

  render() {
    const { users } = this.props.user;
    const { universities } = this.props.university;

    //Counter for list number
    let i = 1;
    // Set rules for showing data
    const showData =
      // Show users data if Users is selected
      this.state.selectedData === "users" ? (
        <Table className="mt-3 text-center">
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
                <UserModal key={uuid()} selectedUser={user} />
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
        <Table className="mt-3 text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Subscribed Until</th>
              <th>Enabled</th>
              <th colSpan="2">Manage</th>
            </tr>
          </thead>
          <tbody>
            {universities.map(university => (
              <tr key={university._id}>
                <th scope="row">{i++}</th>
                <td>{university.name}</td>
                <td>
                  {moment(university.subscribedUntil).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </td>
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
                  key={university._id}
                  tag="td"
                  selectedUniversity={university}
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
      );

    // Show spinner if fetching from database
    if (this.props.isFetching) {
      return (
        <div className="text-center">
          <Spinner id="profile-spinner" color="info" />
        </div>
      );
    } else {
      return (
        <Row className="mt-5">
          <Col xs={12} md={{ size: 10, offset: 1 }}>
            <Button
              color="primary"
              name="users"
              onClick={e => this.handleClick(e)}
            >
              <FaUserGraduate /> Users
            </Button>
            <Button
              color="primary"
              name="universities"
              className="ml-2"
              onClick={e => this.handleClick(e)}
            >
              <FaUniversity /> Universities
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
  modifyUser: PropTypes.func.isRequired,
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
  isFetching: state.university.isFetching || state.user.isFetching
});

// Connect to store
export default connect(
  mapStateToProps,
  {
    getUsers,
    modifyUser,
    deleteUser,
    getUniversities,
    modifyUniversity,
    deleteUniversity
  }
)(AdminPanel);
