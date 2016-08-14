"use strict";

var Promise = require("bluebird");
var requestp = require("request-promise");
var objectAssign = require('object-assign');
var path = require("path");
var fs = require("fs");
var util = require("util");

function requestOptions (pdfdata, path, options) {
    var options = objectAssign(options, pdfdata._api);
    options.url = options.url + path;
    options.pdfdata = pdfdata;
    return options;
}

function json_request (options) {
    return requestp(options).then(
        function (response) {
            if (options.encoding === null) {
                return response;
            } else {
                var body = response.body;
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    throw new _ResponseError(options, response,
                                             "PDFDATA.io's response body was not well-formed JSON");
                }
                
                if (response.statusCode >= 400) {
                    throw new _Error(options, response, body);
                } else {
                    response.body = body;
                    return response;
                }
            }
        });
}

function _return_body (response) {
    return response.body;
}

function _Error (options, response, body) {
    this.requestOptions = options;
    this.response = response;
    this.body = body;
}

function _ResponseError (options, response, message) {
    this.message = message;
    this.requestOptions = options;
    this.response = response;
}

function proxy (pdfdata, fn) {
    return function () {
        return fn.apply(pdfdata, arguments);
    };
}

function createFileFormData (paths) {
    return paths.map(function (p) {
        return {value: fs.createReadStream(p),
                options: {filename: path.basename(p)}};
    });
}

module.exports = {requestOptions: requestOptions,
                  request: json_request,
                  return_body: _return_body,
                  proxy: proxy,
                  createFileFormData: createFileFormData,
                  log: function (x) {
                      console.log(util.inspect(x, {depth: null}));
                  }}
