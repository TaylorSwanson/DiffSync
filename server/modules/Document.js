/**
 * Document object
 * @module Document
 */

var dmp = require("./DiffMatchPatch.js");
var throttle = require("./throttle.js");

var Client = require("./Client.js");

function Document(originalContent) {
    this.content = originalContent || "";
    this.syncedShadow = this.content;

    this.clients = [];
    this.editQueue = [];

    this.throttleFrequency = 100;
    this.throttled = throttle(this.sync.bind(this), this.throttleFrequency);
}

// Enqueue patch to be processed at a later date
Document.prototype.patch = function patch(diffText, client) {
    // TODO: Verify diff format?
    var patches = dmp.patch_fromText(diffText);

    // Patch client shadow that generated the changes
    client.shadow = dmp.patch_apply(patches, client.shadow)[0];

    // Enqueu patches for other clients
    this.editQueue.push(patches);

    this.throttledSync();
};

Document.prototype.throttledSync = (function throttledSync() {
    if (this.throttled) return this.throttled;
    throw new Error("Throttled sync function has already been disposed of");
})();

// Applies edits, creates diff, and sends to clients
Document.prototype.sync = function sync() {
    if (!this.editQueue || this.editQueue.length === 0) return;

    // Fast clone edit queue array in case applying edits takes a while
    var eq = this.editQueue.slice(0);
    this.editQueue = [];
    // Iterate over edit queue, apply patches
    for (var i = 0; i < eq.length; i++) {
        // Apply edits
        this.content = dmp.patch_apply(eq[i], this.content)[0];
    }

    // Edits complete, do diff and patch against shadows
    this.patchClients();

    // Update the shadow to match content
    this.updateShadows();
};

// Sends new patches to all clients
Document.prototype.patchClients = function patchClients() {
    console.log("Patching ", this.clients.length, "clients");

    var standardPatches = dmp.patch_make(this.syncedShadow, this.content);

    for (var i = 0; i < this.clients.length; i++) {
        var c = this.clients[i];
        // Use common patches if client shadow matches the synced shadow
        if (c.shadow == this.syncedShadow) {

            c.patchClient(standardPatches);
            return;
        }
        // Generate patch for this client only
        var patches = dmp.patch_make(c.shadow, this.content);
        c.patchClient(patches);
    }
};

Document.prototype.updateShadows = function updateShadows() {
    this.syncedShadow = this.content;
    for (var i = 0; i < this.clients.length; i++) {
        this.clients[i].shadow = this.syncedShadow;
    }
};

Document.prototype.set = function set(newContent) {
    this.content = newContent;
    this.throttledSync();
};

Document.prototype.close = function close(callback) {
    // TODO: Save and close the document
    // Clean up
    if (this.throttled && this.throttled.cancel) this.throttle.cancel();
    this.throttled = null;

    this.content = null;
    this.syncedShadow = null;

    this.clients = null;
    this.editQueue = null;

    this.throttleFrequency = null;
};

// Generates a new client and returns it
Document.prototype.getClient = function getClient() {
    var c = new Client(this);
    c.shadow = this.content;

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
