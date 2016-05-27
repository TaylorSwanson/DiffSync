/**
 * Shadow object
 * @module Shadow
 */

var md5 = require("./md5.js");

function Shadow(defaultContent) {
    this.content = defaultContent || "";
    this.checksum = md5(this.content);
}

Shadow.prototype.setContent = function setContent(newContent) {
    this.content = newContent || "";
    this.checksum = md5(newContent);
}

Shadow.prototype.clone = function clone() {
    return new Shadow(this.content);
}

module.exports = Shadow;
