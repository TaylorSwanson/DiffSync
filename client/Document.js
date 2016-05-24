/**
 * Document object
 * @module Document
 */

function Document(originalContent) {
    this.content = originalContent || "";
}

Document.prototype.set = function set(newContent) {
    this.content = newContent;
};

Document.prototype.sync = function sync() {

};

module.exports = Document;
