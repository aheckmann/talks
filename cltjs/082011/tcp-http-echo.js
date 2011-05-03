
var http = require('http')
  , net = require('net')
  , parse = require('url').parse
  , colorize = require('./colorize')
  , sockets = [];

// tcp server
var server = net.createServer(function (socket) {
  sockets.push(socket);

  socket.on('data', function (data) {
    say(socket.remoteAddress, data, socket);
  });

  socket.on('end', function () {
    // remove dead socket
    sockets = sockets.filter(function (sock) {
      return sock !== socket;
    });
  });
});
server.listen(9000, function () {
  console.error('telnet localhost %d', server.address().port);
});

// http server which writes to all connected sockets
http.createServer(function (req, res) {
  req.setEncoding('utf8');

  var buf = '';

  req.on('data', function (data) {
    buf += data;
  });

  req.on('end', function () {
    //res.statusCode = 404;
    res.end('queued up\n');

    buf = buf.split(' ');
    return write(buf.shift());

    function write (word) {
      if (!word) return; // all done

      say(req.connection.remoteAddress, word + '\n');

      // print one word per second
      setTimeout(function() {
        write(buf.shift());
      }, 1000);
    }
  });

  req.on('error', function (err) {
    console.error('req error: %s', err);
    res.end('oops');
  });
}).listen(8000);

console.error('http listening on http://localhost:8000')

/**
 * Writes data to every socket in sockets except `socket`.
 */

function say (address, data, socket) {
  var msg = address + ' says: ' + data;
  sockets.forEach(function (sock) {
    // don't write to ourselves
    if (sock === socket) return;
    sock.write(colorize(msg));
  });
}

