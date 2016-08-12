"use strict";

var utils = require("./utils");

function upload (documents, tags) {
    if (typeof documents == "string") {
        documents = [documents];
    }
    if (tags === undefined) tags = [];

    var parts = utils.createFileFormData(documents);
    var options = utils.requestOptions(this, "/documents",
                                       {method: "POST",
                                        formData: {file:parts,
                                                   tag:tags}});
    return utils.request(options).then(utils.return_body);
}

function get (docid) {
    var options = utils.requestOptions(this, "/documents/" + docid,
                                       {method: "GET"});
    return utils.request(options).then(utils.return_body);
}

function list () {
    var options = utils.requestOptions(this, "/documents",
                                       {method: "GET"});
    return utils.request(options).then(utils.return_body);
}

module.exports = {upload: upload,
                  get: get,
                  list: list};
