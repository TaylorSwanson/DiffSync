/**
 * Document object
 * @module Document
 */

function Document() {
    this.content = "";
}

Document.prototype.set = function set(newContent) {
    this.content = newContent;
};

Document.prototype.sync = function sync() {

};

module.exports = Document;
