"use strict";

var pdfdata = require("./base.js").pdfdata;
var assert = require('chai').assert;

describe("service info", function () {
    it("say hello", function (done) {
        pdfdata.info().then(function (result) {
            assert.equal(result.message, "Welcome to PDFDATA.io!");
            assert.match(result.api_version, /^\d{4}-\d\d-\d\d$/);
            assert.match(result.build, /^[\da-f]{40}$/);
            done();
        });
    });
});

