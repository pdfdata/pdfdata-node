"use strict";

var parseURL = require("url").parse;
var utils = require("./utils");

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
    this._setup(["documents", "procs", "resources"]);
}

PDFDATA.DEFAULT_ENDPOINT = "https://api.pdfdata.io/v1/";

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

    info: function () {
        var options = utils.requestOptions(this, "/", {method: "GET"});
        return utils.request(options).then(utils.return_body);
    },

    // this "proxies" all "resource" objects' functions so that `this` is
    // set to this pdfdata object
    _setup: function (resources) {
        var pdfdata = this;
        for (var i in resources) {
            var name = resources[i];
            var methods = require("./" + name);
            for (var mname in methods) {
                methods[mname] = utils.proxy(pdfdata, methods[mname]);
            }
            this[name] = methods;
        }

    }

}

module.exports = PDFDATA;
