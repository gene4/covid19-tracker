/* eslint-disable react/jsx-key */
import React from "react";
import styles from "./Table.module.css";
import numeral from "numeral";

function Table({ countries }) {
    return (
        <div className={styles.table}>
            <table>
                <tbody>
                    {countries.map(({ country, cases }) => (
                        <tr key={country}>
                            <td>{country}</td>
                            <td>
                                <strong>{numeral(cases).format("0,0")}</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
