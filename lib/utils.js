var request = require("request-promise");
var objectAssign = require('object-assign');
var path = require("path");
var fs = require("fs");

function requestOptions (pdfdata, path, options) {
    var options = objectAssign(options, pdfdata._api);
    options.url = options.url + path;
    options.pdfdata = pdfdata;
    return options;
}

function _do_request (options) {
    return request(options).then(
	function (response) {
	    var body;
	    try {
		body = JSON.parse(response.body)
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
		  request: _do_request,
		  return_body: _return_body,
		  proxy: proxy,
		  createFileFormData: createFileFormData}
