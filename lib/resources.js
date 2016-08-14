"use strict";

var utils = require("./utils");
var url = require("url");

function byID (resource_id) {
    var options = utils.requestOptions(this, "/resources/" + resource_id,
                                       {method: "GET",
                                        encoding: null});
    return utils.request(options);
}

function byURL (resource_url) {
    var options = utils.requestOptions(this, "", {method: "GET",
                                                  encoding: null});
    options.url = url.resolve(options.url, resource_url);
    return utils.request(options);
}

module.exports = {byID: byID,
                  byURL: byURL};
