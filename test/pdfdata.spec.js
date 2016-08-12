var apikey = process.env.PDFDATA_APIKEY;
var endpoint = process.env.PDFDATA_ENDPOINT || "https://api.pdfdata.io/v1"

var assert = require('chai').assert;
var path = require("path");

assert.isDefined(apikey);

console.log("Testing with endpoint: " + endpoint);

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

function isID (prefix, id) {
    assert.match(id, new RegExp("^" + prefix + "_" + "[\\da-f]+$"));
}

function checkDate (datestr) {
    assert.equal(datestr.length, 20);
    assert.instanceOf(new Date(datestr), Date);
}

it("upload one", function (done) {
    var file = "package.json";
    var document;
    pdfdata.documents.upload(file)
	.then(function (result) {
	    assert.equal(result.length, 1);
	    document = result[0];
	    isID("doc", document.id);
	    assert.equal(document.type, "doc");
	    assert.equal(document.filename, path.basename(file))
	    checkDate(document.created);
	    checkDate(document.expires);
	    return pdfdata.documents.get(document.id);
	})
	.then(function (result) {
	    assert.deepEqual(document, result);
	    return pdfdata.documents.list();
	})
	.then(function (result) {
	    assert.include(result, document);
	    done();
	});
});
