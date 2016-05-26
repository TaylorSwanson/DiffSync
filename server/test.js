var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 5666 });

var LibOT = require("./index.js");

// Define a dataProvider instance
function dataProvider() { }

dataProvider.prototype.get = function get(id, callback) {
    callback("Default document with id: " + id);
};

var ot = new LibOT(new dataProvider());

ws.on("connection", function connection(ws) {
    console.log("New client; creating session");

    var client = ot.getClient("123");

    ws.on("message", function handleMessage(message) {
        console.log("Received:", message);

        switch(message.type):
            case "close":
                client.disconnect();
                client = undefined;
                ws.close();
                break;
    });

    ws.on("close", function handleClose() {
        if (client) client.disconnect();
        return;
    });
});
