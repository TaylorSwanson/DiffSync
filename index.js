// Document Collaboration Server for SFNT
// Copyright 2015-2016 Taylor Swanson

// Load clustering module and details
var cluster = require("cluster");
var numCPUs = require("os").cpus().length;

// Load configuration
var config 	= require("../api/modules/config.js");

var maxCores = config.cluster.maxCores;


if (cluster.isMaster && config.cluster.enabled) {
    console.log("SFNT OT Server");
    console.log("Copyright 2015-2016 Taylor Swanson" + "\n");

    if (config.debugMode) {
        console.log("Running in debug/local mode" + "\n");
    }

    console.log("\n" + "Starting cluster handler");
    console.log("Available cores:", numCPUs);
    console.log("Max cores:", config.cluster.maxCores + "\n");

    var workers = [];

    // Create worker processes
    for (var i = 0; i < numCPUs && (!maxCores || i < maxCores); i++) {
        // Fork process
        worker = cluster.fork();

        // Monitor worker death
        worker.on("exit", function(code, signal) {
            if (signal) {
                console.log("Worker " + i + " was killed by signal: " + signal);
            } else if( code !== 0 ) {
                console.error("Worker " + i + " exited with error code: " + code);
            } else {
                console.log("Worker " + i + " closed successfully");
            }
        });

        workers.push(worker);
    }

    // Monitor network connections
    cluster.on("listening", function(worker, address) {
        console.log("A worker is now listening on port " + address.port);
    });

} else {
    if (config.cluster.enabled) console.log("Starting worker");

    // Start server
    var app = require("./modules/app.js");

    // Load server routes
    var routes = require("./routes/");

    Date.prototype.addDays = function (d) {
        if (d) {
            var t = this.getTime();
            t = t + (d * 86400000);
            this.setTime(t);
        }
    };
}
