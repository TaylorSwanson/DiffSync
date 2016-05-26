function ClientSession() {
    EventEmitter.call(this);
}

ClientSession.prototype.__proto__ = EventEmitter.prototype;

Document.prototype.set = function set(newContent) {
    this.content = newContent;
};

Document.prototype.sync = function sync() {

};

module.exports = Document;
