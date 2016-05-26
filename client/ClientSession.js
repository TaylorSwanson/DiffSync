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

ClientSession.prototype.edit = function edit(newContent) {
    this.content = newContent;
    // Generate patches
    var patches = patch_make(this.shadow, this.content)[0];
    this.patchQueue.concat(patches);
    // Prepare for more edits/sync with server
    this.updateShadow();
    this.sync();
};

// Applies the server's changes to the client document
ClientSession.patch = function patch(diff) {
    
};

ClientSession.prototype.sync = throttle(function sync() {

}, patchFrequency);

};

module.exports = ClientSession;
