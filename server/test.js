var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 5667 });

var LibOT = require("./index.js");

// Define a dataProvider instance
function dataProvider() { }

dataProvider.prototype.get = function get(id, callback) {
    callback("Default document with id: " + id);
};

var ot = new LibOT(new dataProvider());

wss.on("connection", function connection(ws) {
    console.log("New client; creating session");

    var client = ot.getClient("123");

    // Server updating client with patches
    client.on("patch", function(patches) {
        if (!ws) return;
        ws.send({
            type: "patch",
            patches: patches
        });
    });

    ws.on("message", function handleMessage(message) {
        console.log("Received:", message);

        switch(message.type) {
            // Client disconnecting
            case "close":
                client.disconnect();
                client = undefined;
                ws.close();
                break;
            // Client made changes
            case "patch":
                client.patch(message.patches);
                break;
            default:
                console.error("Received unrecognized message:", message);
        }
    });

    ws.on("close", function handleClose() {
        if (client) client.disconnect();
        return;
    });
});

console.log("Ready");