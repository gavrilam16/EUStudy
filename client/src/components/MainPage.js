import React, { Component } from "react";
import { DATA_SETS, COPYRIGHT } from "../consts";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCountries, deleteCountry } from "../actions/countryActions";

import geographyObject from "../static/world-10m.json";
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  FormGroup,
  Input
} from "reactstrap";
import uuid from "uuid";

import CountryModal from "./countries/CountryModal";
import CountriesMap from "./countries/CountriesMap";
import CountriesList from "./countries/CountriesList";
import CountryInfo from "./countries/CountryInfo";
import ConfirmModal from "./ConfirmModal";
import UniversitiesList from "./universities/UniversitiesList";

import topImage from "../static/images/top.jpg";

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
    // Mark country as isAdded
    this.setState({
      isAdded: true
    });
  };

  // When the confirm modal sends callback
  handleDelete = id => {
    // Delete country from database via deleteCountry action
    this.props.deleteCountry(id);

    let countryData =
      geographyObject.objects.ne_10m_admin_0_countries.geometries;
    countryData.forEach((element, index, countryData) => {
      countryData[index] = element;
      if (element.properties._id === id) {
        element.properties._id = undefined;
        countryData[index] = element;
        console.log(element.properties);
      }
    }, countryData);

    // Will refresh CountryInfo
    this.setState({
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
      this.props.user.currentUser.role === "admin" &&
      this.state.selectedCountry.properties.NAME !== undefined ? (
        [
          // If the country is marked as isAdded show Delete and Modify button
          this.state.isAdded ? (
            <div key={uuid()} className="d-inline country-buttons">
              <CountryModal
                key={uuid()}
                selectedCountry={this.state.selectedCountry.properties}
                modify={true}
                callBack={this.update}
              />
              <ConfirmModal
                key={uuid()}
                tag="div"
                inline={true}
                buttonText="Delete"
                title="Delete"
                message={`Are you sure you want to delete the data for ${
                  this.state.selectedCountry.properties.name
                }?`}
                isSecondButton={true}
                callBack={this.handleDelete.bind(
                  this,
                  this.state.selectedCountry.properties._id
                )}
              />
            </div>
          ) : (
            // Else show Add button
            <div key={uuid()} className="country-buttons ml-5">
              <CountryModal
                selectedCountry={this.state.selectedCountry.properties}
                modify={false}
                callBack={this.update}
              />
            </div>
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
          <Row id="country-panel-top">
            <img id="top-image" src={topImage} alt="students" />
          </Row>
          <Row>
            <Col xs={12} md={{ size: 4, offset: 6 }}>
              <Form inline>
                {/* Data drop-down selector */}
                <FormGroup className="country-selectors">
                  <Input
                    type="select"
                    name="selectedData"
                    className="custom-select"
                    id="selectedData"
                    onChange={e => this.handleSelectData(e)}
                  >
                    {displayDataDropDownOptions}
                  </Input>
                </FormGroup>
                {/* Country drop-down selector*/}
                <FormGroup className="pl-2 country-selectors">
                  <Input
                    type="select"
                    name="selectCountry"
                    className="custom-select"
                    id="selectCountry"
                    value={
                      this.state.selectedCountry.properties.name
                        ? this.state.selectedCountry.properties.name
                        : ""
                    }
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
                          <option key={properties._id}>
                            {properties.name}
                          </option>
                        ) : null
                    )}
                  </Input>
                </FormGroup>
              </Form>
              {/* Countries List */}
            </Col>
          </Row>
          <Row id="country-panel">
            <Col xs={12} md={2} className="d-none d-sm-block">
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
            <Col xs={12} md={2}>
              {/* Country Info*/}
              <CountryInfo
                selectedCountry={this.state.selectedCountry.properties}
                isAdded={this.state.isAdded}
              />
              {/* Add, Modify, Delete Buttons*/}
              {displayButtons}
            </Col>
          </Row>
          <UniversitiesList
            countryCode={this.state.selectedCountry.properties.ISO_A2}
          />
          <hr />
          {/* Footer*/}
          <Row>
            <Col>
              <div className="text-center mt-3 mb-4">
                <a
                  href="https://github.com/gavrilam16"
                  target="_blank"
                  rel="noopener noreferrer"
                  alt="developer name"
                >
                  Mihai Gavrilă
                </a>{" "}
                {COPYRIGHT} {new Date().getFullYear()}
              </div>
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
