import Phaser from 'phaser';
import Game from './scenes/game.js'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3000');

const create = document.getElementById("create");
const join = document.getElementById("join");
const createId = document.getElementById("createId");
const gameid = document.getElementById("gameid");

const main = document.getElementById("main");

create.addEventListener('click', ()=>{
    socket.emit('create', {});
});

join.addEventListener('click', ()=>{
    console.log('game id', gameid.value);
    socket.emit('join', {id: gameid.value});
    gameid.value = "";
});

socket.on('create', (data) => {
    createId.innerHTML = "Game ID: " + data;
});

socket.on('gamestatus', (data) => {
    if(data == true) {
        main.parentNode.removeChild(main);
        socket.disconnect();
        const game = new Phaser.Game(config);
    }

    else {
        alert("Invalid GameID!");
    }
});

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
	height: window.innerHeight,
    scene: [
        Game
    ]
};
//const game = new Phaser.Game(config);
