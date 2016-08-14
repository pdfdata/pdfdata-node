"use strict";

var base = require("./base.js");
var utils = require("../lib/utils");

var Promise = require("bluebird");
var assert = require('chai').assert;
var path = require("path");
var fs = require("fs");
var imagesize = require('image-size');

describe("resources", function () {
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

    it("retrieval", function (done) {
        base.pdfdata.procs.configure()
            .operation({op:"images"})
            .withFiles(["pdfs/i14358.pdf"])
            .start()
            .then(function (result) {
                result = result.documents[0].results[0];
                assert.deepEqual(result, imageResult);
                var resourceRequests = [];
                for (var rsrc_id in result.resources) {
                    resourceRequests.push(base.pdfdata.resources.byID(rsrc_id));
                    resourceRequests.push(base.pdfdata.resources.byURL(result.resources[rsrc_id].url));
                }
                return Promise.all(resourceRequests);
            }).then(function (resources) {
                resources.forEach(function (resp) {
                    assert.equal(resp.headers['content-type'], 'image/png');
                    assert.match(resp.headers["content-disposition"], /^attachment; filename=".+\.png"$/);
                    assert.equal(resp.headers["content-length"], "96082");
                    
                    assert.instanceOf(resp.body, Buffer);
                    assert.equal(resp.body.length, 96082);

                    var dim = imagesize(resp.body);
                    assert.equal(dim.height, 493);
                    assert.equal(dim.width, 1392);
                });
                done();
            }).catch(function (error) {
                console.log(error);
                throw error;
            });
    });
});
