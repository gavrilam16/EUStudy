import React, { Component } from "react";

import { EUR } from "../../consts";

import { Table } from "reactstrap";

class CountriesList extends Component {
  
  render() {
    // Copy countries array so that the sorting does not affect the parent array
    const countries = this.props.countries.map(a => ({ ...a }));
    // Sort array by selectedData
    switch (this.props.selectedData) {
      case "firstCycleFees": {
        countries.sort((a, b) =>
          a.properties.firstCycleFees < b.properties.firstCycleFees ? 1 : -1
        );
        break;
      }
      case "secondCycleFees": {
        countries.sort((a, b) =>
          a.properties.secondCycleFees < b.properties.secondCycleFees ? 1 : -1
        );
        break;
      }
      case "needBasedGrants": {
        countries.sort((a, b) =>
          a.properties.needBasedGrants < b.properties.needBasedGrants ? 1 : -1
        );
        break;
      }
      case "meritBasedGrants": {
        countries.sort((a, b) =>
          a.properties.meritBasedGrants < b.properties.meritBasedGrants ? 1 : -1
        );
        break;
      }
      default:
        break;
    }

    //Counter for list number
    let i = 1;
    return (
      <div>
        <div className="countries-list">
          {/* Table Head */}
          <Table className="m-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Country</th>
                <th>{EUR}</th>
              </tr>
            </thead>
          </Table>
        </div>
        <div className="countries-list">
          {/* Table Body */}
          <Table className="m-0">
            <tbody>
              {countries.map(({ properties }) =>
                properties._id !== undefined ? (
                  <tr key={properties._id}>
                    <th scope="row">{i++}</th>
                    <td>{properties.NAME}</td>
                    {this.props.selectedData === "firstCycleFees" ? (
                      <td> {properties.firstCycleFees}</td>
                    ) : this.props.selectedData === "secondCycleFees" ? (
                      <td> {properties.secondCycleFees}</td>
                    ) : this.props.selectedData === "needBasedGrants" ? (
                      <td> {properties.needBasedGrants}</td>
                    ) : (
                      <td> {properties.meritBasedGrants}</td>
                    )}
                  </tr>
                ) : null
              )}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default CountriesList;
