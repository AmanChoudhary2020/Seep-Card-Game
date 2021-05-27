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
        
        this.load.image('1C', '/src/assets/AC.png');
        this.load.image('1D', '/src/assets/AD.png');
        this.load.image('1H', '/src/assets/AH.png');
        this.load.image('1S', '/src/assets/AS.png');

        this.load.image('2C', '/src/assets/2C.png');
        this.load.image('2D', '/src/assets/2D.png');
        this.load.image('2H', '/src/assets/2H.png');
        this.load.image('2S', '/src/assets/2S.png');
        
        this.load.image('3C', '/src/assets/3C.png');
        this.load.image('3D', '/src/assets/3D.png');
        this.load.image('3H', '/src/assets/3H.png');
        this.load.image('3S', '/src/assets/3S.png');
        
        this.load.image('4C', '/src/assets/4C.png');
        this.load.image('4D', '/src/assets/4D.png');
        this.load.image('4H', '/src/assets/4H.png');
        this.load.image('4S', '/src/assets/4S.png');
        
        this.load.image('5C', '/src/assets/5C.png');
        this.load.image('5D', '/src/assets/5D.png');
        this.load.image('5H', '/src/assets/5H.png');
        this.load.image('5S', '/src/assets/5S.png');

        this.load.image('6C', '/src/assets/6C.png');
        this.load.image('6D', '/src/assets/6D.png');
        this.load.image('6H', '/src/assets/6H.png');
        this.load.image('6S', '/src/assets/6S.png');

        this.load.image('7C', '/src/assets/7C.png');
        this.load.image('7D', '/src/assets/7D.png');
        this.load.image('7H', '/src/assets/7H.png');
        this.load.image('7S', '/src/assets/7S.png');

        this.load.image('8C', '/src/assets/8C.png');
        this.load.image('8D', '/src/assets/8D.png');
        this.load.image('8H', '/src/assets/8H.png');
        this.load.image('8S', '/src/assets/8S.png');

        this.load.image('9C', '/src/assets/9C.png');
        this.load.image('9D', '/src/assets/9D.png');
        this.load.image('9H', '/src/assets/9H.png');
        this.load.image('9S', '/src/assets/9S.png');

        this.load.image('10C', '/src/assets/10C.png');
        this.load.image('10D', '/src/assets/10D.png');
        this.load.image('10H', '/src/assets/10H.png');
        this.load.image('10S', '/src/assets/10S.png');

        this.load.image('11C', '/src/assets/JC.png');
        this.load.image('11D', '/src/assets/JD.png');
        this.load.image('11H', '/src/assets/JH.png');
        this.load.image('11S', '/src/assets/JS.png');

        this.load.image('12C', '/src/assets/QC.png');
        this.load.image('12D', '/src/assets/QD.png');
        this.load.image('12H', '/src/assets/QH.png');
        this.load.image('12S', '/src/assets/QS.png');

        this.load.image('13C', '/src/assets/KC.png');
        this.load.image('13D', '/src/assets/KD.png');
        this.load.image('13H', '/src/assets/KH.png');
        this.load.image('13S', '/src/assets/KS.png');
        
        this.load.setCORS("anonymous")
        this.load.setCORS("Anonymous")
    }

    create() {
        let self = this;
        this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#f5f8f2");

        this.isPlayerA = false;
        this.opponentCards = [];
        this.playerCards = [];
        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Monaco').setColor('#cc8b71');

        this.used_cards = [];

        this.socket = io("http://localhost:3000");

        this.socket.on('connect', () => {
            console.log('connection made on client!');
        });

        this.socket.on('isPlayerA', () => {
            console.log("player A set!");
            this.isPlayerA = true;
            this.dealText.setInteractive();
        });

        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);

        this.dealer = new Dealer(this);

        this.randomCards = (num_of_cards_requested, used_cards) => {
            let arr = [];
            let counter = 0;
            let satisfy = true;
            
            while(counter !== num_of_cards_requested) {
                let min = Math.ceil(1);
                let max = Math.floor(14);
                let rand_num_1 = Math.floor(Math.random() * (max - min) + min);
                
                let min_letter = Math.ceil(1);
                let max_letter = Math.floor(5);
                let rand_num_2 = Math.floor(Math.random() * (max_letter - min_letter) + min_letter);

                if(rand_num_2 == 1) {
                    rand_num_2 = 'C';
                }
                if(rand_num_2 == 2) {
                    rand_num_2 = 'D';
                }
                if(rand_num_2 == 3) {
                    rand_num_2 = 'H';
                }
                if(rand_num_2 == 4) {
                    rand_num_2 = 'S';
                }

                for(let j = 0; j < used_cards.length; ++j) {
                    if(used_cards[j] == (rand_num_1 + rand_num_2)) {
                        satisfy = false;
                    }
                }

                if(satisfy) {
                    counter++;
                    arr.push(rand_num_1 + rand_num_2);
                    used_cards.push(rand_num_1 + rand_num_2)
                    console.log(arr.length, rand_num_1 + rand_num_2);
                }
                satisfy = true;
            }

            return arr;
        }
        
        this.dealText.on('pointerdown', () => {
            let arr = this.randomCards(4, this.used_cards);
            let arr2 = this.randomCards(4, this.used_cards);
            let arr3 = this.randomCards(8, this.used_cards);
            
            let valid_ranks = [];
                
            for(let i = 0; i < arr2.length; ++i) {
                if(arr2[i].length === 2) {
                    valid_ranks.push(arr2[i].substring(0,1))
                }
                else {
                    valid_ranks.push(arr2[i].substring(0,2));
                }
            }

            while(!(valid_ranks.includes('10') || valid_ranks.includes('11') || valid_ranks.includes('12') || valid_ranks.includes('13'))) {
                this.used_cards = [];
                arr = this.randomCards(4, this.used_cards);
                arr2 = this.randomCards(4, this.used_cards);
                arr3 = this.randomCards(8, this.used_cards);
                valid_ranks = [];

                for(let i = 0; i < arr2.length; ++i) {
                    if(arr2[i].length === 2) {
                        valid_ranks.push(arr2[i].substring(0,1))
                    }
                    else {
                        valid_ranks.push(arr2[i].substring(0,2));
                    }
                }
            }

            /*
            let arr = [];
            let counter = 0;
            let satisfy = true;
            while(counter !== 4) {
                let min = Math.ceil(1);
                let max = Math.floor(14);
                let rand_num_1 = Math.floor(Math.random() * (max - min) + min);
                
                let min_letter = Math.ceil(1);
                let max_letter = Math.floor(5);
                let rand_num_2 = Math.floor(Math.random() * (max_letter - min_letter) + min_letter);

                if(rand_num_2 == 1) {
                    rand_num_2 = 'C';
                }
                if(rand_num_2 == 2) {
                    rand_num_2 = 'D';
                }
                if(rand_num_2 == 3) {
                    rand_num_2 = 'H';
                }
                if(rand_num_2 == 4) {
                    rand_num_2 = 'S';
                }

                for(let j = 0; j < arr.length; ++j) {
                    if(arr[j] == (rand_num_1 + rand_num_2)) {
                        satisfy = false;
                    }
                }

                if(satisfy) {
                    counter++;
                    arr.push(rand_num_1 + rand_num_2);
                    console.log(arr.length, rand_num_1 + rand_num_2);
                }
                satisfy = true;
            }
            */
            //this.playerCards = arr2;
            //this.opponentCards = arr3;
            self.socket.emit('dealCards', {d:arr, player_cards:arr2, opponent_cards:arr3, zone:this.dropZone});
        });

        this.socket.on('declareRank', (input_rank) => {
            alert("Player has declared rank " + input_rank);
        });

        this.socket.on('dealCards', (data) => {
            this.playerCards = data.player_cards;
            self.dropZone.data.values.cards = 4;
            console.log(data);
            self.dealer.dealCards(data)
            self.dealText.disableInteractive();

            /*
            if(self.isPlayerA) {
                let input_rank = window.prompt("Enter rank");
                let valid_ranks = [];

                for(let i = 0; i < this.playerCards.length; ++i) {
                    if(this.playerCards[i].length === 2) {
                        valid_ranks.push(this.playerCards[i].substring(0,1))
                    }
                    else {
                        valid_ranks.push(this.playerCards[i].substring(0,2));
                    }
                }
                console.log(valid_ranks);
                while(!(valid_ranks.includes(input_rank) && input_rank >= 10 && input_rank <= 13)) {
                    input_rank = window.prompt("Invalid rank. Enter again");
                }
            }

            self.socket.emit('declareRank', input_rank);
            */

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
            console.log('dropped', dropZone.data.values.cards);

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
        });
    }

    update() {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();
    }
}
