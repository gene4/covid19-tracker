import {
    FormControl,
    MenuItem,
    Select,
    Card,
    CardContent,
} from "@mui/material";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import InfoBox from "../components/InfoBox";
import Table from "../components/Table";
import { sortData, prettyPrintStat } from "../utils/utils";
import LineGraph from "../components/LineGraph";
import dynamic from "next/dynamic";

export default function Home() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    const [mapCenter, setMapCenter] = useState({
        lat: 34.80746,
        lng: -40.4796,
    });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountries = async () => {
            await fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2,
                        id: country.countryInfo._id,
                    }));
                    const sortedData = sortData(data);
                    setCountries(countries);
                    setTableData(sortedData);
                    setMapCountries(data);
                });
        };
        getCountries();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);
                if (countryCode === "worldwide") {
                    setMapCenter([34.80746, -40.4796]);
                    setMapZoom(3);
                } else {
                    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                    setMapZoom(4);
                }
            });
    };

    const Map = dynamic(() => import("../components/Map"), { ssr: false });

    return (
        <div className={styles.container}>
            <Head>
                <title>Covid-19 Tracker</title>
                <meta
                    name="Covid-19 Tracker App"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.app_left}>
                    <header className={styles.row_container}>
                        <h1 className={styles.title}>Covid-19 Tracker</h1>
                        <FormControl className={styles.dropdown}>
                            <Select
                                variant="outlined"
                                value={country}
                                onChange={onCountryChange}
                            >
                                <MenuItem value="worldwide">Worldwide</MenuItem>
                                {countries.map((country) => (
                                    <MenuItem
                                        key={country.id}
                                        value={country.value}
                                    >
                                        {country.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </header>
                    <div className={styles.row_container}>
                        <InfoBox
                            onClick={() => setCasesType("cases")}
                            active={casesType === "cases"}
                            isRed
                            title="Coronavirus Cases"
                            total={prettyPrintStat(countryInfo.cases)}
                            cases={prettyPrintStat(countryInfo.todayCases)}
                        />
                        <InfoBox
                            onClick={() => setCasesType("recovered")}
                            active={casesType === "recovered"}
                            title="Recovered"
                            total={prettyPrintStat(countryInfo.recovered)}
                            cases={prettyPrintStat(countryInfo.todayRecovered)}
                        />
                        <InfoBox
                            onClick={() => setCasesType("deaths")}
                            active={casesType === "deaths"}
                            isRed
                            title="Deaths"
                            total={prettyPrintStat(countryInfo.deaths)}
                            cases={prettyPrintStat(countryInfo.todayDeaths)}
                        />
                    </div>
                    <Map
                        center={mapCenter}
                        zoom={mapZoom}
                        countries={mapCountries}
                        casesType={casesType}
                    />
                </div>
                <Card className={styles.app_right}>
                    <CardContent
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                        }}
                    >
                        <h3>Live Cases By Country</h3>
                        <Table countries={tableData}></Table>
                        <LineGraph casesType={casesType} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
