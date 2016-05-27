/**
 * A client that attaches to a document
 * @module Client
 */

var events = require("events");

var dmp = require("./DiffMatchPatch.js");

var md5 = require("./md5.js");

function Shadow(defaultContent) {
    this.content = defaultContent || "";
    this.checksum = md5(this.content);
}

Shadow.prototype.setContent = function setContent(newContent) {
    this.content = newContent || "";
    this.checksum = md5(newContent);
}

module.exports = Shadow;
