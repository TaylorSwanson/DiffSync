/**
 * OT Interface
 * @module OT Interface
 */

var documentManager = require("./modules/DocumentManager.js");

function DiffSync(dataProvider) {
    this.dataProvider = dataProvider;
};

// Get a client instance attached to the specified document
DiffSync.prototype.getClient = function getClient(id, callback) {
    if (documentManager.isOpen(id)) {
        return callback(null, documentManager.get(id).getClient());
    }
    documentManager.create(this.dataProvider, id, function(err, doc) {
        callback(err, doc ? doc.getClient() : null);
    });
};

module.exports = DiffSync;
