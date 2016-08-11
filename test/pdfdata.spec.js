var apikey = process.env.PDFDATA_APIKEY;
var endpoint = process.env.PDFDATA_ENDPOINT || "https://api.pdfdata.io/v1"

var assert = require('chai').assert

assert.isDefined(apikey);

var pdfdata = require("../lib/pdfdata")(apikey);
pdfdata.setEndpoint(endpoint);

it("info", function (done) {
    pdfdata.info().then(function (result) {
	assert.equal(result.message, "Welcome to PDFDATA.io!");
	assert.match(result.api_version, /^\d{4}-\d\d-\d\d$/);
	assert.match(result.build, /^[\da-f]{40}$/);
	done();
    });
});
