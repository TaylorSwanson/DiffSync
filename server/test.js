var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 5667 });

var DiffSync = require("./index.js");

// Define a dataProvider instance
function dataProvider() { }

dataProvider.prototype.get = function get(id, callback) {
    callback("Default document with id: " + id);
};

dataProvider.prototype.set = function set(id, content) {
    console.log("Document", id, "saved:", content);
};

var ot = new DiffSync(new dataProvider());



wss.on("connection", function connection(ws) {
    console.log("New client; creating session");

    var resync = function resync() {
        ws.send(JSON.stringify({
            type: "content",
            content: client.getContent()
        }));
    };

    var client;

    ot.getClient("123", function(err, newClient) {
        client = newClient;
        resync(ws);
    });

    // Server updating client with patches
    client.on("patch", function(patches) {
        if (!ws) return;
        ws.send(JSON.stringify({
            type: "patch",
            patches: patches
        }));
    });

    // Client and server are out of sync
    client.on("resync", function() {
        if (!ws) return;
        resync(ws);
    });

    ws.on("message", function handleMessage(message) {

        message = JSON.parse(message);

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
                client.patchServer(message.patches, message.checksum);
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
