"use strict";

var base = require("./base.js");
var utils = require("../lib/utils");

var Promise = require("bluebird");
var assert = require('chai').assert;
var path = require("path");
var fs = require("fs");

describe("procs", function () {
    var metadataResult = {op: 'metadata',
                          data: {Title: '',
                                 Creator: 'wkhtmltopdf 0.12.2.4',
                                 Producer: 'Qt 4.8.6',
                                 CreationDate: '2016-08-12T04:07:16Z'}};
    var imageResult = {op: 'images',
                       data: 
                       [{type: 'page',
                         images: 
                         [{type: 'img',
                           bounds: [18.909943, 733.7, 259.80994, 819.2],
                           resource: 'rsrc_fa2b6308dbfc27e24c22cc10d2282879d79395cb'}],
                         pagenum: 0,
                         dimensions: [595,842]}],
                       resources: 
                       {rsrc_fa2b6308dbfc27e24c22cc10d2282879d79395cb: 
                        {format: 'png',
                         dimensions: [1392, 493],
                         url: '/v1/resources/rsrc_fa2b6308dbfc27e24c22cc10d2282879d79395cb',
                         mimetype: 'image/png'}}};

    function oneproc (config, done) {
        var createResult;
        return base.pdfdata.procs.configure(config).start()
            .then(function (result) {
                createResult = result;
                assert.equal(result.documents.length, 1);
                assert.deepEqual(result.documents[0].results,
                                 [metadataResult]);
                return result;
            }).then(function (result) {
                return base.pdfdata.procs.get(result.id);
            }).then(function (result) {
                assert.deepEqual(result, createResult);
            }).then(function (result) {
                done();
            }).catch(function (error) {
                console.log(error);
                throw error;
            });
    }

    it("one new file", function (done) {
        oneproc({operations: [{op:"metadata"}],
                 file: ["pdfs/7BECP84117T.pdf"]},
                done);
    });
    
    it("by docid", function (done) {
        base.pdfdata.documents.upload("pdfs/7BECP84117T.pdf")
            .then(function (result) {
                oneproc({operations: [{op:"metadata"}],
                         docid: [result[0].id]},
                        done);
            }).catch(function (error) {
                console.log(error);
                throw error;
            });
    });

    it("by tag", function (done) {
        base.pdfdata.documents.upload("pdfs/7BECP84117T.pdf", "proc-test-by-tag")
            .then(function (result) {
                oneproc({operations: [{op:"metadata"}],
                         tag:["proc-test-by-tag"]},
                        done);
            }).catch(function (error) {
                console.log(error);
                throw error;
            });
    });

    it("multiple files", function (done) {
        var file = base.pdfs[0];
        var document;
        var createResult;
        base.pdfdata.procs.configure()
            .operation({op:"metadata"})
            .withFiles(base.pdfs)
            .start()
            .then(function (result) {
                createResult = result;
                assert.equal(result.documents.length, base.pdfs.length);
                var results = result.documents.map(function (doc) {
                    return doc.results[0];
                });
                assert.include(results, metadataResult);
                results.forEach(function (r) {
                    utils.checkDate(r.data.CreationDate);
                    assert.equal(r.op, "metadata");
                });
                return base.pdfdata.procs.get(result.id);
            }).then(function (result) {
                assert.deepEqual(result, createResult);
            }).then(function (result) {
                done();
            }).catch(function (error) {
                console.log(error);
                throw error;
            });
    });

    it("multiple files, multiple ops", function (done) {
        var createResult;
        base.pdfdata.procs.configure()
            .operation({op:"metadata"})
            .operations([{op:"images"}])
            .withFiles(base.pdfs)
            .start()
            .then(function (result) {
                createResult = result;
                assert.equal(result.documents.length, base.pdfs.length);
                var results =
                    Array.prototype.concat.apply([],
                                                 result.documents.map(function (doc) {
                                                     return doc.results;
                                                 }));
                assert.equal(results.length, base.pdfs.length * 2);
                assert.include(results, metadataResult);
                assert.include(results, imageResult);
                return base.pdfdata.procs.get(result.id);
            }).then(function (result) {
                assert.deepEqual(result, createResult);
            }).then(function (result) {
                done();
            }).catch(function (error) {
                console.log(error);
                throw error;
            });
    });
    
    it("polling completion", function (done) {
        base.pdfdata.procs.configure({operations: [{op:"metadata"}, {op:"images"}],
                                      file: base.pdfs,
                                      wait: 0})
            .start()
            .then(function (result) {
                assert.equal(result.status, "pending");
                return base.pdfdata.procs.getCompleted(result.id, 30000, 1000);
            }).then(function (result) {
                assert.equal(result.status, "complete");
                assert.equal(result.documents.length, base.pdfs.length);
                result.documents.forEach(function (doc) {
                    assert.equal(doc.results.length, 2);
                });
                done();
            }).catch(function (error) {
                console.log(error);
                throw error;
            });
    });
});

