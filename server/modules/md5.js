/**
* Symple node crypto md5 wrapper function
* @module md5
*/

var crypto = require("crypto");

var digest = function(string, encoding) {
    var hash = crypto.createHash("md5");
    return hash.update(string, "utf8")
               .digest(encoding || "hex");
};

module.exports = digest;
