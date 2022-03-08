import React from "react";
import { Circle, MapContainer, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";
import numeral from "numeral";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 120,
    },
    recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 120,
    },
    deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 1000,
    },
};

export const showDataOnMap = (data, casesType = "cases") =>
    data.map((country) => (
        <>
            <Circle
                center={[country.countryInfo.lat, country.countryInfo.long]}
                color={casesTypeColors[casesType].hex}
                fillColor={casesTypeColors[casesType].hex}
                fillOpacity={0.4}
                radius={
                    Math.sqrt(country[casesType]) *
                    casesTypeColors[casesType].multiplier
                }
            >
                <Popup>
                    <div className={styles.info_container}>
                        <div
                            className={styles.info_flag}
                            style={{
                                backgroundImage: `url(${country.countryInfo.flag})`,
                            }}
                        ></div>
                        <div className={styles.info_name}>
                            {country.country}
                        </div>
                        <div className={styles.info_confirmed}>
                            Cases: {numeral(country.cases).format("0,0")}
                        </div>
                        <div className={styles.info_recovered}>
                            Recovered:{" "}
                            {numeral(country.recovered).format("0,0")}
                        </div>
                        <div className={styles.info_deaths}>
                            Deaths: {numeral(country.deaths).format("0,0")}
                        </div>
                    </div>
                </Popup>
            </Circle>
        </>
    ));

function Map({ countries, center, zoom, casesType }) {
    return (
        <div className={styles.map}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{
                    height: "100%",
                }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    );
}

export default Map;
