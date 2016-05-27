// Underscore-like throttle
// https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
    deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date,
        args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

var patchFrequency = 500;
var dmp = new diff_match_patch();

function ClientSession(defaultContent) {
    EventEmitter.call(this);

    this.content = defaultContent || "";
    this.shadow = this.content;

    this.patchQueue = [];
}

ClientSession.prototype.__proto__ = EventEmitter.prototype;

ClientSession.prototype.updateShadow = function updateShadow() {
    this.shadow = this.content;
};

ClientSession.prototype.getContent = function getContent() {
    return this.content;
};

ClientSession.prototype.edit = function edit(newContent) {
    this.content = newContent;
    // Generate patches
    var patches = dmp.patch_make(this.shadow, this.content)[0];
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
    this.shadow = dmp.patch_apply(patches, this.shadow)[0];
    this.content = dmp.patch_apply(patches, this.content)[0];

    // // Sync any new changes
    // if (this.shadow !== this.content) this.sync();
};

// Throttled function that sends edits to server
ClientSession.prototype.sync = throttle(function sync() {
    if (!this.patchQueue || this.patchQueue.length === 0) return;

    var diffText = dmp.patch_toText(this.patchQueue);
    if (!diffText) return;

    this.emit("patch", diffText);
    this.patchQueue = [];
}, patchFrequency);
