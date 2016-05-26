/**
 * A client that attaches to a document
 * @module Client
 */

var events = require("events");

var dmp = require("./DiffMatchPatch.js");

function Client(doc) {
    if (!doc) return new Error("Document must be provided when creating a client");
    this.doc = doc;

    this.patchQueue = [];
    this.patchFrequency = 1;

    events.EventEmitter.call(this);
}

Client.prototype.__proto__ = events.EventEmitter.prototype;

// This client is disconnecting
Client.prototype.disconnect = function disconnect() {
    this.doc.removeClient(this);
    this.doc = undefined;
};

// Applies server-side edits to be sent to the client
Client.prototype.patch = function patch(patches) {
    this.patchQueue.push(patches);
};

// Applies the client's edit to the doc
Client.prototype.edit = function edit(diff) {
    // Calculate patches from diff text
    var patches = dmp.patch_fromText(diff);
    this.doc.patch(patches);
};
