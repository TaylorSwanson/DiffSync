/**
 * Document Manager; stores server Documents
 */

module.exports = (function() {
    
    var documentMap = {};

    return {
        // Returns a document from cache or creates a new one
        get: function get(id) {
            if (isOpen(id)) return documentMap[id];
        },
        // Returns true if the document is presently open
        isOpen: function isOpen(id) {
            return (documentMap.hasOwnProperty(id));
        }
    }
});
