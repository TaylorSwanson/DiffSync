/**
 * Document Manager; stores server Documents
 */

var Document = require("./Document.js");

module.exports = (function() {

    var documentMap = {};

    // Returns true if the document is presently open
    var isOpen = function isOpen(id) {
        return (documentMap[id] != undefined);
    };

    // Returns a document from cache or creates a new one
    var get = function get(id) {
        if (isOpen(id)) return documentMap[id];

        var d = new Document();
        documentMap[id] = d;

        return d;
    };

    // Creates a document from existing data and returns its instance
    // If document already exists, it simply returns that instance
    var create = function create(dataProvider, id, callback) {
        if (isOpen(id)) return callback(null, get(id));

        // Load data from provider
        dataProvider.get(id, function(data) {
            var d = new Document(data);
            documentMap[id] = d;

            callback(null, d);
        });
    };

    var close = function close(id, callback) {
        if (!isOpen(id)) return callback();

        documentMap[id].close(callback);
    };

    return {
        get: get,
        isOpen: isOpen,
        create: create,
        close: close
    };
})();
