if (process.argv.length < 3) return;
const redirectTarget = process.argv[2];
const redirectInput = process.argv[3];

const net = require('net');

const log = (...args) => {
    console.log(`[${new Date()}]`, ...args);
}

const server = net.createServer(function (socket) {
    socket.on("error", (err) => {
        log("Caught server socket error: ");
        console.error(err.stack);
    });
    const client = new net.Socket();
    client.connect(redirectInput, '127.0.0.1', function () {
        log('Connected');
    });
    client.on('data', function (data) {
        socket.write(data);
    });
    client.on('close', function () {
        log("adios client");
        socket.destroy();
    });
    socket.on("data", (data) => {
        client.write(data);
    });
    client.on("error", (err) => {
        log("Caught client socket error: ");
        console.error(err.stack);
    });
    socket.on('close', () => {
        log("adios server");
        client.destroy();
    });
});

server.listen(redirectTarget, '0.0.0.0');
