/**
 * Document object
 * @module Document
 */

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

module.exports = Document;
