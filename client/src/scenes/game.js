import Card from '../helpers/card.js'
import Zone from '../helpers/zone.js'
//import socket from '../index.js'
import Dealer from '../helpers/dealer.js'
//const io = require('socket.io-client');
import io from 'socket.io-client'

export default class Game extends Phaser.Scene {
    constructor () {
        super({
            key: 'Game'
        });
    }
    
    preload() {
        this.load.image('redBack', '/src/assets/red_back.png');
        this.load.image('yellowBack', '/src/assets/yellow_back.png');
        this.load.image('QS', '/src/assets/QS.png');
        this.load.image('QH', '/src/assets/QH.png');
        this.load.setCORS("anonymous")
        this.load.setCORS("Anonymous")
    }

    create() {
        let self = this;
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#f5f8f2");

        this.isPlayerA = false;
        this.opponentCards = [];

        this.socket = io("http://localhost:3000");

        this.socket.on('connect', () => {
            console.log('connection made on client!');
        });

        this.socket.on('isPlayerA', () => {
            console.log("player A set!");
            this.isPlayerA = true;
        });

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Monaco').setColor('#cc8b71').setInteractive();
        
        this.dealText.on('pointerdown', () => {
            self.socket.emit('dealCards');
        });

        this.socket.on('dealCards', () => {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });

        this.dealText.on('pointerover', () => {
            self.dealText.setColor('#d45b2a');
        })

        this.dealText.on('pointerout', () => {
            self.dealText.setColor('#cc8b71')
        });

        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setTint(0xd45b2a);
            self.children.bringToTop(gameObject);
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            //Dropped: true if gameObject dropped in drop zone
            if(!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
            gameObject.setTint();
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        });

        this.socket.on('cardPlayed', (gameObject, isPlayerA) => {
            console.log("card played");
            if(isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + self.dropZone.data.values.cards * 50), (self.dropZone.y), sprite).disableInteractive();  
            }
        })
    }

    update() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();
    }
}
