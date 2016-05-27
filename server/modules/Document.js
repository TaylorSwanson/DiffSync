/**
 * Document object
 * @module Document
 */

var dmp = require("./DiffMatchPatch.js");
var throttle = require("./throttle.js");

var Client = require("./Client.js");
var Shadow = require("./Shadow.js");

function Document(originalContent) {
    this.content = originalContent || "";
    this.syncedShadow = new Shadow(this.content);

    this.clients = [];
    this.editQueue = [];

    this.closeFunction = null;
    this.saveFunction = null;
    this.saveInterval = null;

    this.throttleFrequency = 100;
    this.throttled = throttle(this.sync.bind(this), this.throttleFrequency);
}

// Enqueue patch to be processed at a later date
Document.prototype.patch = function patch(diffText, client) {
    // TODO: Verify diff format?
    var patches = dmp.patch_fromText(diffText);

    // Patch client shadow that generated the changes
    client.shadow.setContent(dmp.patch_apply(patches, client.shadow.content)[0]);

    // Enqueu patches for other clients
    this.editQueue.push(patches);

    this.throttledSync();
};

Document.prototype.throttledSync = function throttledSync() {
    if (this.throttled) return this.throttled();
    throw new Error("Throttled sync function has already been disposed of");
};

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

    var standardPatches = dmp.patch_make(this.syncedShadow.content, this.content);

    for (var i = 0; i < this.clients.length; i++) {
        var c = this.clients[i];
        // Use common patches if client shadow matches the synced shadow
        if (c.shadow.content == this.syncedShadow.content) {
            console.log("Client", i, "didn't make changes; will receive standard patches");
            c.patchClient(standardPatches);
            return;
        }
        // Generate patch for this client only
        var patches = dmp.patch_make(c.shadow.content, this.content);
        if (patches.length > 0) c.patchClient(patches);
    }
};

Document.prototype.updateShadows = function updateShadows() {
    this.syncedShadow.setContent(this.content);
    for (var i = 0; i < this.clients.length; i++) {
        this.clients[i].shadow.setContent(this.syncedShadow.content);
    }
};

Document.prototype.set = function set(newContent) {
    this.content = newContent;
    this.throttledSync();
};

Document.prototype.save = function save() {
    console.log("Saving");
    if (!this.saveFunction) throw new Error("Cannot save document without providing a save handler first");
    this.sync();
    this.saveFunction(this.content);
};

Document.prototype.setSaveHandler = function setSaveHandler(saveFunction, frequency) {
    if (this.saveInterval) clearInterval(this.saveInterval);
    this.saveFunction = saveFunction;

    // Start saving every freq. ms
    this.saveInterval = setInterval(this.save().bind(this), frequency);
};

Document.prototype.setCloseHandler = function setCloseHandler(closeFunction) {
    this.closeFunction = closeFunction;
};

Document.prototype.close = function close(callback) {
    console.log("Closing");
    // Save the document
    this.save();
    this.closeFunction();

    // Clean up
    this.content = null;
    this.syncedShadow = null;

    this.clients = null;
    this.editQueue = null;

    this.closeFunction = null;

    this.saveFunction = 0;
    if (this.saveInterval) clearInterval(this.saveInterval);

    if (this.throttled && this.throttled.cancel) this.throttle.cancel();
    this.throttleFrequency = null;
    this.throttled = null;
};

// Generates a new client and returns it
Document.prototype.getClient = function getClient() {
    var c = new Client(this);
    c.shadow.setContent(this.content);

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
