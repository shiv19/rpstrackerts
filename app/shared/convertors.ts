import * as app from "application";
import { ItemType } from "../core/constants";
const moment = require("moment");

// Date convertor
const dateConvertor = function(value) {
    if (value !== undefined) {
        return moment(value).format("MMM D, YYYY");
    } else {
        return "";
    }
};

// Convert an item to the indicator calss name
const itemToIndicatorClassConvertor = function(value) {
    if (value !== undefined) {
        return ItemType.indicatorClassFromType(value.type);
    } else {
        return "";
    }
};

// Registering convertors
app.getResources().dateConvertor = dateConvertor;
app.getResources().itemToIndicatorClassConvertor = itemToIndicatorClassConvertor;
