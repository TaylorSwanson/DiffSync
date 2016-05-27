/**
 * A client that attaches to a document
 * @module Client
 */

var events = require("events");

var dmp = require("./DiffMatchPatch.js");
var throttle = require("./throttle.js");

var md5 = require("./md5.js");

function Client(doc) {
    if (!doc) return new Error("Document must be provided when creating a client");
    this.doc = doc;
    this.shadow = "";
    this.backup = "";

    // List of patches that need to be sent to client
    this.patchQueue = [];

    // Time to wait before sending patch messages to client
    this.throttleFrequency = 500;
    // Start throttled sync interval
    this.throttled = throttle(this.sync.bind(this), this.throttleFrequency);

    // Apply EventEmitter properties to this
    events.EventEmitter.call(this);
}

Client.prototype.__proto__ = events.EventEmitter.prototype;

// This client is disconnecting
Client.prototype.disconnect = function disconnect() {
    this.doc.removeClient(this);
    this.doc = null;
    this.patchQueue = null;
    this.shadow = null;

    if (this.throttled && this.throttled.cancel) this.throttled.cancel();
    this.throttled = null;
};

// Applies server-side edits to be sent to the client
Client.prototype.patchClient = function patchClient(patches) {
    this.patchQueue.push(patches);
};

// Clear patchQueue
Client.prototype.recallPatches = function recallPatches() {
    this.patchQueue = [];
}

Client.prototype.throttledSync = (function throttledSync() {
    if (this.throttled) return this.throttled;
    throw new Error("Throttled sync function has already been disposed of");
})();

// Sends patches to client
Client.prototype.sync = function sync() {
    // Ignore empty
    if (!this.patchQueue || this.patchQueue.length === 0) return;

    var diffText = dmp.patch_toText(this.patchQueue);
    if (!diffText) return;

    this.emit("patch", diffText);
    this.patchQueue = [];
};

// Applies the client's edit to the doc
Client.prototype.patchServer = function patchServer(patches) {
    this.doc.patch(patches, this);
};

// Gets the Document's content
Client.prototype.getContent = function getContent() {
    return (this.doc ? this.doc.getContent() : "");
};

module.exports = Client;
