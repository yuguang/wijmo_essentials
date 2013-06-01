
var app = require('http').createServer(handler)
    , path = require("path")
    , fs = require('fs')

app.listen(80);

function read_file(response) {
    return function (err, data) {
        response.writeHead(200);
        response.end(data);
    }
}

function handler(request, response) {
    request.on('end', function () {
        if (request.url.substring(0, 4) == '/lib') {
            fs.readFile(path.join(__dirname, '..', request.url), read_file(response));
        } else {
            var filePath = '.' + request.url;

            path.exists(filePath, function(exists) {

                if (exists) {
                    fs.readFile(filePath, function(error, content) {
                        if (error) {
                            response.writeHead(500);
                            response.end();
                        }
                        else {
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end(content, 'utf-8');
                        }
                    });
                }
                else {
                    response.writeHead(404);
                    response.end();
                }
            });
        }
    });
}