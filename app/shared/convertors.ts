import * as app from "application";
import { ItemType } from "../core/constants";
const moment = require("moment");

// Date converter
const dateConverter = function (value) {
    if (value !== undefined) {
        return moment(value).format("MMM D, YYYY");
    } else {
        return "";
    }
};

// Convert an item to the indicator calss name
const itemToIndicatorClassConverter = function (value) {
    if (value !== undefined) {
        return ItemType.indicatorClassFromType(value.type);
    } else {
        return "";
    }
};

// Registering converters
app.getResources().dateConverter = dateConverter;
app.getResources().itemToIndicatorClassConverter = itemToIndicatorClassConverter;
