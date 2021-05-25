export default class Card {
    constructor(scene) {
        this.render = (x,y,sprite) => {
            let card = scene.add.image(x,y,sprite).setScale(0.2,0.2).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}
