import React, { Component } from "react";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUsers } from "../../actions/userActions";
import {
  getUniversities,
  modifyUniversity
} from "../../actions/universityActions";

import { Row, Col, FormGroup, Input, CustomInput, Table, Spinner } from "reactstrap";

class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      selectedData: "Users"
    };
  }

  componentDidMount() {
    // Get users from store via getUsers action
    this.props.getUsers();
    this.props.getUniversities();
  }

  handleSelect = e => {
    this.setState({
      [e.target.name]: e.target.value
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

  render() {
    const { users } = this.props.user;
    const { universities } = this.props.university;

    //Counter for list number
    let i = 1;
    // Set rules for showing data
    const showData = !this.props.university.isFetching ? (
      // Show users data if Users is selected
      this.state.selectedData === "Users"  ? (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>University</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <th scope="row">{i++}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.university}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        // Show universities data if Universities is selected
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {universities.map(university => (
              <tr key={university._id}>
              {console.log(university._id)}
                <th scope="row">{i++}</th>
                <td>{university.name}</td>
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
              </tr>
            ))}
          </tbody>
        </Table>
      )) : (
          <Spinner color="info" />
      );
    return (
      <Row className="mt-5">
        <Col>
          <FormGroup>
            <Input
              type="select"
              name="selectedData"
              id="selectedData"
              defaultValue={this.state.selectedData}
              onChange={e => this.handleSelect(e)}
            >
              <option>Users</option>
              <option>Universities</option>
              )}
            </Input>
          </FormGroup>
          {showData}
        </Col>
      </Row>
    );
  }
}

// Set propTypes
AdminPanel.propTypes = {
  getUsers: PropTypes.func.isRequired,
  getUniversities: PropTypes.func.isRequired,
  modifyUniversity: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  university: PropTypes.object.isRequired,
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user,
  university: state.university,
});

// Connect to store
export default connect(
  mapStateToProps,
  { getUsers, getUniversities, modifyUniversity }
)(AdminPanel);