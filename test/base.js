"use strict";

var assert = require('chai').assert;
var path = require("path");
var fs = require("fs");

var apikey = process.env.PDFDATA_APIKEY;
var endpoint = process.env.PDFDATA_ENDPOINT || "https://api.pdfdata.io/v1"

assert.isDefined(apikey);

console.log("Testing with endpoint: " + endpoint);

var pdfdata = require("../lib/pdfdata")(apikey);
pdfdata.setEndpoint(endpoint);

var pdfs = fs.readdirSync("pdfs").map(function (filename) {
    return path.join("pdfs", filename);
});

function isID (prefix, id) {
    assert.match(id, new RegExp("^" + prefix + "_" + "[\\da-f]+$"));
}

function checkDate (datestr) {
    assert.equal(datestr.length, 20);
    assert.instanceOf(new Date(datestr), Date);
}

module.exports = {pdfdata: pdfdata,
                  isID: isID,
                  checkDate: checkDate,
                  pdfs: pdfs}
