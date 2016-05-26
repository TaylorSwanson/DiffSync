/**
 * A client that attaches to a document
 * @module Client
 */

var events = require("events");

var dmp = require("./DiffMatchPatch.js");

function Client(doc) {
    if (!doc) return new Error("Document must be provided when creating a client");
    this.doc = doc;

    // List of patches that need to be sent to client
    this.patchQueue = [];
    // Time to wait before sending patch messages to client
    this.patchFrequency = 500;

    // Start patch check interval
    this.patchInterval = setInterval(this.sendPatches, this.patchFrequency);

    // Apply EventEmitter properties to this
    events.EventEmitter.call(this);
}

Client.prototype.__proto__ = events.EventEmitter.prototype;

// This client is disconnecting
Client.prototype.disconnect = function disconnect() {
    this.doc.removeClient(this);
    this.doc = undefined;
    this.patchQueue = [];

    clearInterval(this.patchInterval);
};

// Applies server-side edits to be sent to the client
Client.prototype.patch = function patch(patches) {
    this.patchQueue.push(patches);
};

// Clear patchQueue
Client.prototype.recallPatches = function recallPatches() {
    this.patchQueue = [];
}

// Sends patches to client
Client.prototype.sendPatches = function sendPatches() {
    // Ignore empty
    if (!this.patchQueue || this.patchQueue.length === 0) return;

    this.emit("patch", this.patchQueue);
    this.patchQueue = [];
};

// Applies the client's edit to the doc
Client.prototype.edit = function edit(diff) {
    // Calculate patches from diff text
    var patches = dmp.patch_fromText(diff);
    this.doc.patch(patches);
};

module.exports = Client;
