import { clamp } from './util.js';

class Player {
    static width = 10;
    static height = 100;
    static color = 'red';
    static speed = .5;

    constructor({name, position, canvas}) {
        this.score = 0;
        this.position = position;
        this.moveUp = false;
        this.moveDown = false;
        this.canvas = canvas;
        this.name = name;
    }

    draw(context) {
        context.fillStyle = Player.color;
        context.fillRect(this.position.x, this.position.y, Player.width, Player.height);

    }

    move(deltaTime) {
        let direction = 0;
        if (this.moveUp)
            direction -= 1;
        if (this.moveDown)
            direction += 1;

        const velocity = Player.speed * direction * deltaTime;

        this.position.y += velocity;
        this.position.y = clamp(this.position.y, 0, this.canvas.height - Player.height);
    }
}

export default Player;
