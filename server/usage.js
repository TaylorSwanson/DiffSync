var LibOT = require("./index.js");

function dataProvider() { }

dataProvider.prototype.get = function get(id, callback) {
    callback("Default document with id: "+ id);
};

var ot = new LibOT(new dataProvider());

var d1c1 = ot.getClient(1);
var d1c2 = ot.getClient(1);
var d2c1 = ot.getClient(2);
var d2c2 = ot.getClient(2);

// Just thinking....
ws.clientConnect(function(socket) {

    var docClient;

    socket.on("message", type, message) {
        switch (type) {
            case "patch":
                if (!docClient) return;
                docClient.edit(diff);
                break;
            case "close":
                if (docClient) docClient.disconnect();
                break;
            case "auth":
                if (docClient) return;
                docClient = ot.getClient(message.id);

                // docClient events
                docClient.on("patch", function(diff) {
                    socket.send("patch", diff);
                });
                break;
        }
    };

    docClient.on("")
})
