import * as app from "application";
const moment = require("moment");

// Date convertor
const dateConvertor = function(value) {
    if (value !== undefined) {
        return moment(value).format("Do MMM YYYY");
    } else {
        return "";
    }
};

// Registering convertors
app.getResources().dateConvertor = dateConvertor;
