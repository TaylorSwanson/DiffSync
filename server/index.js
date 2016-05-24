/**
 * OT Interface
 * @module OT Interface
 */

var documentManager = require("../modules/DocumentManager.js");

function OT(dataProvider) {
    this.dataProvider = dataProvider;

    // Get a client instance attached to the specified document
    getClient: function getClient(id, callback) {
        if (documentManager.isOpen(id)) {
            return callback(null, documentManager.get(id));
        }
        documentManager.create(this.dataProvider, id, callback);
    }
};

module.exports = OT;
