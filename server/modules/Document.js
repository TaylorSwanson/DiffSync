/**
 * Document object
 * @module Document
 */

var events = require("events");

var dmp = require("./DiffMatchPatch.js");

function Document(originalContent) {
    this.content = originalContent || "";
    this.clients = [];
}

// Notifies clients of changes
Document.prototype.sync = function sync() {
    // TODO: Throttle for each client
};

Document.prototype.set = function set(newContent) {
    this.content = newContent;
    this.sync();
};

Document.prototype.close = function close(callback) {
    // TODO: Save and close the document
};

// Generates a new client and returns it
Document.prototype.getClient = function getClient() {
    var c = new Client(this);
    this.clients.push(c);

    return c;
};

// Remove the provided client object from the docuemnt
Document.prototype.removeClient = function removeClient(client) {
    var index = this.clients.indexOf(client);
    if (index !== -1) this.clients.splice(index, 1);

    // TODO: Check number of clients, remove if nobody's here
};

module.exports = Document;
