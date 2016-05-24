/**
 * A client that attaches to a document
 * @module Client
 */

var events = require("events");

function Client(doc) {
    if (!doc) return new Error("Document must be provided when creating a client");
    this.doc = doc;

    events.EventEmitter.call(this);
}

Client.prototype.__proto__ = events.EventEmitter.prototype;

// This client is disconnecting
Client.prototype.disconnect = function disconnect() {
    this.doc.removeClient(this);
    this.doc = undefined;
};

// Applies the provided diff to the document
Client.prototype.edit = function edit(diff) {

};
