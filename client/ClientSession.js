var EventEmitter = require("events").EventEmitter;

var dmp = require("./DiffMatchPatch.js");
var throttle = require("./throttle.js");

var Shadow = require("./Shadow.js");

var patchFrequency = 500;

function ClientSession(defaultContent) {
    EventEmitter.call(this);

    this.content = defaultContent || "";
    this.shadow = new Shadow(this.content);

    this.patchQueue = [];
}

ClientSession.prototype.__proto__ = EventEmitter.prototype;

ClientSession.prototype.updateShadow = function updateShadow() {
    this.shadow.updateContent(this.content);
};

ClientSession.prototype.getContent = function getContent() {
    return this.content;
};

ClientSession.prototype.edit = function edit(newContent) {
    this.content = newContent;
    // Generate patches
    var patches = dmp.patch_make(this.shadow.content, this.content)[0];
    this.patchQueue.push(patches);
    // Prepare for more edits/sync with server
    this.updateShadow();
    this.sync();
};

// Applies the server's changes to the client document
ClientSession.prototype.patchClient = function patchClient(diffText) {
    // Extract patches from text
    var patches = dmp.patch_fromText(diffText);
    // Apply patches
    // NOTE: Shadow and content may not be the same now
    this.content = dmp.patch_apply(patches, this.content)[0];
    this.shadow.updateContent(dmp.patch_apply(patches, this.shadow.content)[0]);
};

// Throttled function that sends edits to server
ClientSession.prototype.sync = throttle(function sync() {
    if (!this.patchQueue || this.patchQueue.length === 0) return;

    var diffText = dmp.patch_toText(this.patchQueue);
    if (!diffText) return;

    this.emit("patch", diffText);
    this.patchQueue = [];
}, patchFrequency);

module.exports = ClientSession;
