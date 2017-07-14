"use strict";

var parseURL = require("url").parse;
var utils = require("./utils");

function PDFDATA (key) {
    if (!(this instanceof PDFDATA)) {
        return new PDFDATA(key);
    }

    if (!key) key = process.env.PDFDATA_APIKEY;

    if (!key || typeof key != 'string') {
        throw new Error("PDFDATA.io API key must be provided when creating an API client instance, " +
            "either by setting the `PDFDATA_APIKEY` environment variable, or as an argument " +
                "when requiring the `pdfdata` module, e.g. `require(\"pdfdata\")(\"API_KEY\")`. " +
                "If you don't have a PDFDATA.io " +
                "API key yet, you can get one free at https://www.pdfdata.io/register");
    }

    this._api = {resolveWithFullResponse:true,
                 simple:false,
                 headers:{"X-API-Intent": "Y"}};
    this.setApiKey(key);
    this.setEndpoint(PDFDATA.DEFAULT_ENDPOINT);
    this._setup(["documents", "procs", "resources"]);
}

PDFDATA.DEFAULT_ENDPOINT = process.env.PDFDATA_ENDPOINT || "https://api.pdfdata.io/v1";

PDFDATA.prototype = {
    setApiKey: function (key) {
        this._api.auth = {"username": key};
    },
    setEndpoint: function (url) {
        this._api.url = url;
    },
    getEndpoint: function () {
        return this._api.url;
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
            var module = require("./" + name);
            var methods = {};
            for (var mname in module) {
                methods[mname] = utils.proxy(pdfdata, module[mname]);
            }
            this[name] = methods;
        }

    }

}

module.exports = PDFDATA;
