import React, { Component } from "react";
import { DATA_SETS } from "../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCountries, deleteCountry } from "../actions/countryActions";

import geographyObject from "../static/world-10m.json";
import { Container, Row, Col, Spinner, FormGroup, Input } from "reactstrap";
import uuid from "uuid";

import CountryModal from "./countries/CountryModal";
import CountriesMap from "./countries/CountriesMap";
import CountriesList from "./countries/CountriesList";
import CountryInfo from "./countries/CountryInfo";
import ConfirmModal from "./ConfirmModal";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCountry: {
        properties: {}
      },
      isAdded: false,
      isLoading: true,
      selectedData: DATA_SETS[0].name
    };
  }

  componentDidMount() {
    // Get countries from store via getCountries action
    this.props.getCountries();
  }

  componentWillReceiveProps({ country }) {
    // When the component gets the array of countries
    const { countries } = country;
    if (countries !== undefined && countries.length > 0) {
      // Map data from store to geographyObject for each country
      geographyObject.objects.ne_10m_admin_0_countries.geometries.forEach(
        element => {
          // Search country by name
          const foundCountry = countries.filter(
            e => e.name === element.properties.NAME
          );
          // Add data to geographyObject if country is in store
          if (foundCountry !== undefined && foundCountry.length > 0) {
            element.properties = Object.assign(
              element.properties,
              foundCountry[0]
            );
            // Add flags to geographyObject for each country data if not in store
          } else {
            for (let prop of DATA_SETS) {
              element.properties[prop.name] = -1;
            }
          }
        }
      );
      // Stop spinner
      this.setState({
        isLoading: false
      });
    }
  }

  // When user selects another set of data from drop-down
  handleSelectData = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // When user selects a country from drop-down
  handleSelectCountry = e => {
    const seekedCountry = e.target.value;
    // Search country by name
    const foundCountry = geographyObject.objects.ne_10m_admin_0_countries.geometries.filter(
      e => seekedCountry === e.properties.NAME
    );
    // Set country as selectedCountry
    this.setState({
      selectedCountry: foundCountry[0],
      isAdded: true
    });
  };

  // Set selected country when user clicks on the map in CountriesMap component
  handleClick = callBackSelected => {
    this.setState({
      ...this.state,
      ...callBackSelected
    });
  };

  // When the country modal sends callback after add or modify
  update = () => {
    // Get the updated array of country
    this.props.getCountries();
    // Mark country as isAdded - will refresh the CountryInfo component
    this.setState({
      isAdded: true
    });
  };

  // When the confirm modal sends callback
  handleDelete = async id => {
    // Delete country from database via deleteCountry action
    await this.props.deleteCountry(id);
    // Get the updated array of country
    await this.props.getCountries();
    // Set the country id as undefined in geograpyObject
    geographyObject.objects.ne_10m_admin_0_countries.geometries.forEach(
      element => {
        if (element.properties._id === id) {
          element.properties._id = undefined;
        }
      }
    );
    // Set the country id as undefined in selectedCountry and mark it as not isAdded
    this.setState({
      selectedCountry: {
        ...this.state.selectedCountry,
        properties: {
          ...this.state.selectedCountry.properties,
          _id: undefined
        }
      },
      isAdded: false
    });
  };

  render() {
    // Dinamically set the data set being displayed in the data drop-down selector
    const displayDataDropDownOptions = DATA_SETS.map((element, i) => {
      return (
        <option key={i} value={element.name}>
          {element.forScreen}
        </option>
      );
    });

    // Rules for Add, Modify, Delete buttons display
    const displayButtons =
      // If admin and a country is selected
      this.props.user.currentUser.role === "admin" && this.state.selectedCountry.properties.NAME !== undefined ?  (
        [
          // If the country is marked as isAdded show Delete and Modify button
          this.state.isAdded ? (
            <div key={uuid()} className="d-inline">
              <ConfirmModal
                key={uuid()}
                buttonText="Delete"
                title="Delete"
                message={`Are you sure you want to delete the data for ${
                  this.state.selectedCountry.properties.name
                }?`}
                callBack={this.handleDelete.bind(
                  this,
                  this.state.selectedCountry.properties._id
                )}
              />
              <CountryModal
                key={uuid()}
                selectedCountry={this.state.selectedCountry.properties}
                modify={true}
                callBack={this.update}
              />
            </div>
          ) : (
            // Else show Add button
            <CountryModal
              key={uuid()}
              selectedCountry={this.state.selectedCountry.properties}
              modify={false}
              callBack={this.update}
            />
          )
        ]
      ) : (
        <div />
      );

    // Show spinner if component is receiving props
    if (this.state.isLoading) {
      return <Spinner id="map-spinner" color="info" />;
    } else {
      return (
        <Container className="container-fluid">
          <Row className="mt-5">
            <Col xs="12" md="2">
              {/* Data drop-down selector */}
              <FormGroup>
                <Input
                  type="select"
                  name="selectedData"
                  id="selectedData"
                  onChange={e => this.handleSelectData(e)}
                >
                  {displayDataDropDownOptions}
                </Input>
              </FormGroup>
              {/* Countries List */}
              <CountriesList
                countries={
                  geographyObject.objects.ne_10m_admin_0_countries.geometries
                }
                selectedData={this.state.selectedData}
              />
            </Col>
            {/* Europe Map*/}
            <CountriesMap
              selectedData={this.state.selectedData}
              callBack={this.handleClick}
            />
            <Col xs="12" md="2">
              {/* Country drop-down selector*/}
              <FormGroup>
                <Input
                  type="select"
                  name="selectCountry"
                  id="selectCountry"
                  value={this.state.selectedCountry.properties.name}
                  onChange={e => this.handleSelectCountry(e)}
                >
                  <option value="" hidden>
                    {" "}
                    Choose a country{" "}
                  </option>
                  {geographyObject.objects.ne_10m_admin_0_countries.geometries.map(
                    ({ properties, i }) =>
                      // Display only countries with store data
                      properties._id !== undefined ? (
                        <option key={properties._id}>{properties.name}</option>
                      ) : null
                  )}
                </Input>
              </FormGroup>
              {/* Country Info*/}
              <CountryInfo
                selectedCountry={this.state.selectedCountry.properties}
                isAdded={this.state.isAdded}
              />
              {/* Add, Modify, Delete Buttons*/}
              {displayButtons}
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

// Set propTypes
MainPage.propTypes = {
  user: PropTypes.object.isRequired,
  getCountries: PropTypes.func.isRequired,
  country: PropTypes.object.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  user: state.user,
  country: state.country
});

// Connect to store
export default connect(
  mapStateToProps,
  { getCountries, deleteCountry }
)(MainPage);
