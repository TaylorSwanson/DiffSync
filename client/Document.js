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

Document.prototype.close = function close(callback) {
    // TODO: Save and close the document
};

module.exports = Document;
