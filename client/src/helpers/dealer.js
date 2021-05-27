import Card from './card.js'
import Zone from './zone.js'
export default class Dealer {
    constructor(scene) {
        this.dealCards = (input) => {
            let playerSprite;
            let opponentSprite;
            let num_start_cards_player;
            let num_start_cards_opponent;

            if(scene.isPlayerA) {
                playerSprite = 'redBack';
                opponentSprite = 'yellowBack';
                num_start_cards_player = 4;
                num_start_cards_opponent = 8;
            }

            else {
                playerSprite = 'yellowBack';
                opponentSprite = 'redBack';
                num_start_cards_player = 8;
                num_start_cards_opponent = 4;
            }
            
            if(scene.isPlayerA) {
                for(let i = 0; i < input.player_cards.length; ++i) {
                    let playerCard = new Card(scene);
                    playerCard.render(475 + (i * 100), 650, input.player_cards[i]);
                }
            }

            else {
                for(let i = 0; i < input.opponent_cards.length; ++i) {
                    let playerCard = new Card(scene);
                    playerCard.render(475 + (i * 100), 650, input.opponent_cards[i]);
                }
            }

            for(let i = 0; i < num_start_cards_opponent; ++i) {
                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }

            /*
            for(let i = 0; i < num_start_cards_player; i++) {
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 650, playerSprite);
            }

            
            for(let i = 0; i < num_start_cards_opponent; ++i) {
                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }
            */          
            for(let i = 0; i < input.d.length; ++i) {
                let centerCard = new Card(scene);                
                let x = (input.zone.x - 350) + (i * 50);
                let y = input.zone.y;
                centerCard.render(x, y, input.d[i]).disableInteractive();
            }  
            
            //callback();
        }
    }
}
