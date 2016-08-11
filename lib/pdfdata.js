"use strict";

var parseURL = require("url").parse;
var request = require("request-promise");
var objectAssign = require('object-assign');

function PDFDATA (key) {
    if (!(this instanceof PDFDATA)) {
	return new PDFDATA(key);
    }

    if (!key || typeof key != 'string') {
	throw new Error("PDFDATA.io API key must be provided when creating an API client instance, " +
			"e.g. `require(\"pdfdata\")(\"API_KEY\")`");
    }

    this._api = {resolveWithFullResponse:true,
		 simple:false};
    this.setApiKey(key);
    this.setEndpoint(PDFDATA.DEFAULT_ENDPOINT);
}

PDFDATA.DEFAULT_ENDPOINT = "https://api.pdfdata.io/v1/";

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

function requestOptions (pdfdata, path) {
    var options = objectAssign({}, pdfdata._api);
    options.url = options.url + path;
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
	    
	    if (response.statusCode > 400) {
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

PDFDATA.prototype = {
    setApiKey: function (key) {
	this._api.auth = {"username": key};
    },
    setEndpoint: function (url) {
	this._api.url = url;
	var url = parseURL(url);
	if (url.hostname != "api.pdfdata.io") {
	    this._api.rejectUnauthorized = false;
	    this._api.headers = {"Host": "api.pdfdata.io:" + (url.port || 443)};
	} else {
	    delete this._api.rejectUnauthorized;
	    this._api.headers = {};
	}
    },

    info: function (callback) {
	var options = objectAssign(requestOptions(this, ""),
				   {method: "GET",
				    pdfdata: this});
	return _do_request(options, callback).then(_return_body);
    }

}


module.exports = PDFDATA;
