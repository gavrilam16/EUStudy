import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { EUR } from "../../consts";

import { Spinner } from "reactstrap";

class CountryInfo extends Component {
  
  render() {
    const country = this.props.selectedCountry;

    // Rules for displaying the EU flag
    const displayEuFlag = country.euMember ? (
      <img
        src="https://www.countryflags.io/EU/flat/64.png"
        alt="country flag"
      />
    ) : null;

    // Show spinner if fetching from database
    if (this.props.isFetching) {
      return (
        <div className="country-info text-center">
          <h4 className="font-weight-bold mt-5">Loading...</h4>
          <Spinner id="country-info-spinner" color="light" />
        </div>
      );
      // If no country is selected display message
    } else if (country.firstCycleFees === undefined) {
      return (
        <div className="country-info text-center">
          Choose a country from the map or from the drop-down list
        </div>
      );
      // If the country is marked as added show data
    } else if (this.props.isAdded) {
      return (
        <div className="country-info text-center">
          <h4 className="font-weight-bold">{country.name}</h4>
          <img
            src={`https://www.countryflags.io/${country.ISO_A2}/flat/64.png`}
            alt="country flag"
          />
          {displayEuFlag}
          <div>
            <hr className="m-2" />
            <h6 className="lead font-weight-bold">Study Fees</h6>
            <h6 className="text-left">
              First cycle: <b>{country.firstCycleFees}</b> {EUR}
            </h6>
            <h6 className="text-left">
              Second cycle: <b>{country.secondCycleFees}</b> {EUR}
            </h6>
            <h6 className="text-left">
              <small>{country.payingFees}</small>
            </h6>
            <hr className="m-2" />
            <h6 className="lead font-weight-bold">Grants</h6>
            <h6 className="text-left">
              Need-based: <b>{country.needBasedGrants}</b> {EUR}
            </h6>
            <h6 className="text-left">
              Merit-based: <b>{country.meritBasedGrants}</b> {EUR}
            </h6>
            <h6 className="text-left">
              <small>{country.receivingGrants}</small>
            </h6>
          </div>
        </div>
      );
      // Else show no data message
    } else {
      return (
        <div className="country-info text-center">
          <h4 className="font-weight-bold mt-5">No data</h4>
        </div>
      );
    }
  }
}

// Set propTypes
CountryInfo.propTypes = {
  isFetching: PropTypes.bool.isRequired
};

// Map state to props
const mapStateToProps = state => ({
  isFetching: state.country.isFetching
});

// Connect to store
export default connect(mapStateToProps)(CountryInfo);
