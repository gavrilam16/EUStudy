import React, { Component } from "react";
import { MAP_COLORS } from "../../consts";

import geographyObject from "../../static/world-10m.json";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from "react-simple-maps";
import { geoAzimuthalEqualArea } from "d3-geo";
import { scaleLinear } from "d3-scale";

import { Col } from "reactstrap";
import ReactTooltip from "react-tooltip";

class CountriesMap extends Component {
  // Center map projection on Europe
  projection(width, height, config) {
    return geoAzimuthalEqualArea()
      .rotate([-10, -57, 0])
      .scale(config.scale);
  }

  // Set selected country when user clicks on the map
  handleClick = geography => {
    let callBackSelected = {};
    if (geography.properties.firstCycleFees === -1) {
      callBackSelected = { selectedCountry: geography, isAdded: false };
    } else {
      callBackSelected = { selectedCountry: geography, isAdded: true };
    }
    this.props.callBack(callBackSelected);
  };

  render() {
    // Set the colors range for the cloropeth map
    const popScale = scaleLinear()
      .domain([-1, 0, 500, 2500, 5000, 10000])
      .range(MAP_COLORS);

    return (
      <Col xs="12" md="8">
        <ComposableMap
          projection={this.projection}
          projectionConfig={{ scale: 1135 }}
          width={1176}
          height={661}
        >
          <ZoomableGroup center={[-6, 60]}>
            <Geographies geography={geographyObject} disableOptimization>
              {(geographies, projection) =>
                geographies.map((geography, i) => (
                  <Geography
                    key={`geography-${i}`}
                    cacheId={`geography-${i}`}
                    data-tip={geography.properties.NAME}
                    data-border
                    geography={geography}
                    projection={projection}
                    onClick={() => this.handleClick(geography)}
                    style={{
                      // On default style
                      default: {
                        // Fill choropleth based on the country data display
                        fill:
                          this.props.selectedData === "firstCycleFees"
                            ? popScale(geography.properties.firstCycleFees)
                            : this.props.selectedData === "secondCycleFees"
                            ? popScale(geography.properties.secondCycleFees)
                            : this.props.selectedData === "needBasedGrants"
                            ? popScale(geography.properties.needBasedGrants)
                            : popScale(geography.properties.meritBasedGrants),
                        stroke: "#888888",
                        strokeWidth: 0.5,
                        outline: "none"
                      },
                      // On hover style
                      hover: {
                        fill: "#4d97c5",
                        stroke: "#888888",
                        strokeWidth: 1,
                        outline: "none"
                      },
                      // On pressed style
                      pressed: {
                        fill: "#e2dff2",
                        stroke: "#888888",
                        strokeWidth: 1,
                        outline: "none"
                      }
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <ReactTooltip />
      </Col>
    );
  }
}

export default CountriesMap;
