/**
 * OT Interface
 * @module OT Interface
 */

var documentManager = require("../modules/DocumentManager.js");

function LibOT(dataProvider) {
    this.dataProvider = dataProvider;

    // Get a client instance attached to the specified document
    getClient: function getClient(id, callback) {
        if (documentManager.isOpen(id)) {
            return callback(null, documentManager.get(id).getClient());
        }
        documentManager.create(this.dataProvider, id, function(err, document) {
            callback(err, document ? document.getClient() : null);
        });
    }
};

module.exports = LibOT;
