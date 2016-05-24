/**
 * Document object
 * @module Document
 */

var Client = require("./Client.js");

function Document() {
    this.clients = [];
    this.content = "";
}

// Add a client to the document
Document.prototype.newClient = function newClient() {
    var c = new Client();
    this.clients.push(c);

    return c;
};
