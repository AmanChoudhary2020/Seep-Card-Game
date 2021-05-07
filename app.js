var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, resp) {
    console.log('request was made: ' + req.url);
    if(req.url === '/home' || req.url === '/') {
        resp.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(__dirname + '/index.html').pipe(resp);
    } else {
        resp.writeHead(404, {})
    }
});

server.listen(3000, '127.0.0.1');
console.log('listening to port 3000');
 