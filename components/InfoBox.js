import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import styles from "./InfoBox.module.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`${styles.infoBox} ${
                active && styles.infoBox_selected
            } ${isRed && styles.infoBox_red}`}
        >
            <CardContent>
                <Typography
                    className={styles.infoBox_title}
                    color="textSecondary"
                >
                    {title}
                </Typography>
                <h2
                    className={`${styles.infoBox_cases} ${
                        !isRed && styles.infoBox_cases_green
                    }`}
                >
                    {cases}
                </h2>
                <Typography
                    className={styles.infoBox_total}
                    color="textSecondary"
                >
                    {total}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox;
