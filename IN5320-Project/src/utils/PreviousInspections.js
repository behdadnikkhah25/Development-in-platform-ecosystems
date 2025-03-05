import React from "react";
import {ActiveStatusIcon} from "../components/icons/ActiveStatusIcon";
import {CompletedStatusIcon} from "../components/icons/CompletedStatusIcon";
import {CancelledStatusIcon} from "../components/icons/CancelledStatusIcon";

export const capitalizeFirstLetter = (string) => {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const statusIcon = (status) => {
    status = status.toLowerCase();
    if(status === 'completed') {
        return (
            <CompletedStatusIcon size={24} color="#1b5e20"/>
        );
    } else if (status === 'active') {
        return (
            <ActiveStatusIcon size={24} color="#bb460d"/>
        );
    } else if (status === 'cancelled') {
        return (
            <CancelledStatusIcon size={24} color="#891515"/>
        );
    }
}

export const getCondition = (condition, exists) => {
    if(exists === "false"){
        return(
            "Not Present"
        );
    } else {
        switch (condition) {
            case '1':
                return "Very Poor";
            case '2':
                return "Poor";
            case '3':
                return "Acceptable";
            case '4':
                return "Good";
            case '5':
                return "Excellent";
            default:
                return "Unknown";
        }
    }
};