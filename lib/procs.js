"use strict";

var utils = require("./utils");
var objectAssign = require('object-assign');
var Promise = require("bluebird");

function Proc (pdfdata, config) {
    this.pdfdata = pdfdata;
    this.params = config;
}

var sourceTypes = ["file", "tag", "docid"];

function addSource (type, sources) {
    var proc = this;
    sourceTypes.forEach(function (source) {
        if (source != type && proc.params[source]) {
            throw new Error("Proc is already configured with a `" + source +
                            "` source: " + proc.params[source]);
        }
    });

    this.params[type] = this.params[type] || [];
    Array.prototype.push.apply(this.params[type], sources);
    return this;
}

Proc.prototype = {
    withFiles: function (documentPaths) {
        return addSource.call(this, "file", documentPaths);
    },
    withTags: function (tags) {
        return addSource.call(this, "tag", tags);
    },
    withDocuments: function (documentIDs) {
        return addSource.call(this, "docid", documentIDs);
    },
    operation: function (operation) {
        return this.operations([operation]);
    },
    operations: function (operations) {
        this.params.operations = this.params.operations || [];
        Array.prototype.push.apply(this.params.operations, operations);
        return this;
    },
    start: function () {
        if (!this.params.file && !this.params.tag && !this.params.docid)
            throw new Error("Cannot start proc with no source defined (files, tags, or existing documents)");
        if (this.params.operations.length == 0)
            throw new Error("Cannot start proc without adding at least one operation");

        var params = objectAssign({}, this.params);
        params.operations = JSON.stringify(params.operations);
        if (params.file) params.file = utils.createFileFormData(params.file);
        
        var options = utils.requestOptions(this.pdfdata, "/procs",
                                           {method: "POST",
                                            formData: params});
        return utils.request(options).then(utils.return_body);
    }
}

function configure (config) {
    return new Proc(this, config || {});
}

function get (procid) {
    procid = typeof procid == "string" ? procid : procid.id;
    var options = utils.requestOptions(this, "/procs/" + procid,
                                       {method: "GET"});
    return utils.request(options).then(utils.return_body);
}

function getCompleted (procid, timeout_ms, polling_interval) {
    if (procid.type == "proc" && procid.status == "complete") {
	return procid;
    }
    
    var pdfdata = this;
    procid = typeof procid == "string" ? procid : procid.id;
    if (!timeout_ms) throw new Error("Must specify a timeout period when waiting for a completed proc response");
    if (!polling_interval || polling_interval < 1000) polling_interval = 3000;
    
    return get.call(this, procid)
        .then(function (proc) {
            if (proc.status == "pending" && timeout_ms > 0) {
                var delay = Math.min(polling_interval, timeout_ms);
                return Promise.delay(delay)
                    .then(function () {
                        return getCompleted.call(pdfdata, procid, Math.max(0, timeout_ms - delay));
                    });
            } else {
                return proc;
            }
        });
}

module.exports = {configure:configure,
                  get: get,
                  getCompleted: getCompleted};

