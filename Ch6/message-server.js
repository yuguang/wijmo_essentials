var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
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
        if (request.url == '/send') {
            fs.readFile(__dirname + '/knockout-send-message.html', read_file(response));
        } else if (request.url == '/dashboard') {
            fs.readFile(__dirname + '/knockout-dashboard.html', read_file(response));
        } else if (request.url.substring(0, 4) == '/lib') {
            fs.readFile(path.join(__dirname, '..', request.url), read_file(response));
        }
    });
}

io.sockets.on('connection', function (socket) {
    socket.on('message', function (data) {
        socket.broadcast.emit('news', data);
    });
});