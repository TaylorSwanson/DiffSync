var LibOT = require("./index.js");

function dataProvider() { }

dataProvider.prototype.get = function get(id, callback) {
    callback("Default new document content!");
};

var ot = new LibOT(new dataProvider());

var d1c1 = ot.getClient(1);
var d1c2 = ot.getClient(1);
var d2c1 = ot.getClient(2);
var d2c2 = ot.getClient(2);
