"use strict";

var base = require("./base.js");
var utils = require("../lib/utils.js");

var Promise = require("bluebird");
var assert = require('chai').assert;
var path = require("path");
var fs = require("fs");

describe("document management", function () {
    it("upload one", function (done) {
        var file = base.pdfs[0];
        var document;
        base.pdfdata.documents.upload(file)
            .then(function (result) {
                assert.equal(result.length, 1);
                document = result[0];
                base.isID("doc", document.id);
                assert.equal(document.type, "doc");
                assert.equal(document.filename, path.basename(file))
                utils.checkDate(document.created);
                utils.checkDate(document.expires);
                return base.pdfdata.documents.get(document.id);
            })
            .then(function (result) {
                assert.deepEqual(document, result);
                return base.pdfdata.documents.list();
            })
            .then(function (result) {
                assert.include(result, document);
                done();
            });
    });

    it("upload many", function (done) {
        var documents;
        var filenames = base.pdfs.map(function (p) {
            return path.basename(p);
        });
        var tags = ["test-tag", "Group123"];
        base.pdfdata.documents.upload(base.pdfs, tags)
            .then(function (result) {
                assert.equal(result.length, base.pdfs.length);
                documents = result;
                documents.forEach(function (document) {
                    base.isID("doc", document.id);
                    assert.equal(document.type, "doc");
                    assert.include(filenames, document.filename);
                    utils.checkDate(document.created);
                    utils.checkDate(document.expires);
                    tags.forEach(function (tag) {
                        assert.include(document.tags, tag);
                    });
                });

                return Promise.map(documents, function (document) {
                    return base.pdfdata.documents.get(document.id);
                });
            })
            .then(function (result) {
                documents.forEach(function (document) {
                    assert.include(result, document);
                });

                return base.pdfdata.documents.list();
            })
            .then(function (result) {
                documents.forEach(function (document) {
                    assert.include(result, document);
                });
                done();
            }).catch(console.log);
    });

    it("listings")
});
