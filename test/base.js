"use strict";

var assert = require('chai').assert;
var path = require("path");
var fs = require("fs");

var apikey = process.env.PDFDATA_APIKEY;

assert.isDefined(apikey, "No PDFDATA_APIKEY environment variable set");

var pdfdata = require("../lib/pdfdata")("abcd");
assert.equal(pdfdata._api.auth.username, "abcd");

pdfdata = require("../lib/pdfdata")();
assert.equal(pdfdata._api.auth.username, apikey);

console.log("Testing with endpoint: " + pdfdata.getEndpoint());

var pdfs = fs.readdirSync("pdfs").map(function (filename) {
    return path.join("pdfs", filename);
});

function isID (prefix, id) {
    assert.match(id, new RegExp("^" + prefix + "_" + "[\\da-f]+$"));
}

module.exports = {pdfdata: pdfdata,
                  isID: isID,
                  pdfs: pdfs}
