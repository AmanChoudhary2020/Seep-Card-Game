const server = require('express')();
const http = require('http').createServer(server);
const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

let players = [];
let id = {};
let num_players = 0;

io.on('connection', (socket) => {
    console.log("user connected ", socket.id);

    players.push(socket.id);

    console.log("players length", players.length);
    if(players.length === 1) {
        io.emit('isPlayerA');
    }

    socket.on('dealCards', () => {
        io.emit('dealCards');
    });

    socket.on('cardPlayed', (gameObject, isPlayerA) => {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        players = players.filter(player => player !== socket.id);
        console.log("deleted", players.length);
    });

    socket.on('create', (data) => {
        id = Math.random();
        console.log('game created', id);
        socket.emit('create',id);
    });

    socket.on('join', (data) => {
        console.log(id, data.id);
        if(data.id == id && num_players < 3) {
            io.sockets.emit('gamestatus',true);
            console.log("valid id");
            ++num_players;
        }

        else {
            socket.emit('gamestatus',false);
        }
    });
});


http.listen(3000, () => {
    console.log("server started!");
});
