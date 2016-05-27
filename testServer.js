// var http = require("http");

var serverFactory = require("spa-server");

var server = serverFactory.create({
    path: "./",
    port: 8070,
    fallback: {
        "text/javascript": "./OTClient.js",
        "*": "./test.html"
    },
    middleware: [
        function (request, response, next) {
            console.log(request.url);
            // Don't allow browser to cache (this is the test server, after all)
            response.setHeader("Cache-Control", "max-age=0, must-revalidate");
            next();
        }
    ]
});

server.start();
