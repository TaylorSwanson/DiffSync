/**
 * Document object
 * @module Document
 */

var events = require("events");

var dmp = require("./DiffMatchPatch.js");

var Client = require("./Client.js");

function Document(originalContent) {
    this.content = originalContent || "";
    this.shadowList = [];
    this.clients = [];

    this.updateShadow();

    this.editQueue = [];

    this.syncFrequency = 250;
    this.syncInterval = setInterval(this.sync.bind(this), this.syncFrequency);
}

// Enqueue patch to be processed at a later date
Document.prototype.patch = function patch(diffText) {
    // TODO: Verify diff format?
    console.log("Received patches");
    var patches = dmp.patch_fromText(diffText);
    this.editQueue.push(patches);
};

// Applies edits, creates diff, and sends to clients
Document.prototype.sync = function sync() {
    if (!this.editQueue || this.editQueue.length === 0) return;

    console.log("Syncing", this.editQueue.length);

    // Fast clone edit queue array in case applying edits takes a while
    var eq = this.editQueue.slice(0);
    this.editQueue = [];
    // Iterate over edit queue, apply patches
    for (var i = 0; i < eq.length; i++) {
        // Apply edits
        this.content = dmp.patch_apply(eq[i], this.content)[0];
        this.patchShadow(eq[i]);
    }

    // Edits complete, do diff against shadow
    // Send changes to all clients
    this.patchClients();

    // Update the shadow to match content
    this.updateShadow();
};

// Sends new patches to all clients
Document.prototype.patchClients = function patchClients() {
    console.log("Patching ", this.clients.length, "clients");
    for (var i = 0; i < this.clients.length; i++) {
        var patches = dmp.patch_make(this.clients[i].shadow, this.content);
        this.clients[i].patchClient(patches);
    }
};

Document.prototype.updateShadow = function updateShadow() {
    for (var i = 0; i < this.clients.length; i++) {
        this.clients[i].shadow = this.content;
    }
};

// Applies patches to every shadow
Document.prototype.patchShadow = function patchShadow(patches) {
    for (var i = 0; i < this.clients.length; i++) {
        this.clients[i].shadow = dmp.patch_apply(patches, this.clients[i].shadow)[0];
    }
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

Document.prototype.getContent = function getContent() {
    return this.content;
};

module.exports = Document;
