import Theme from './Theme.js';

class Ball {
    static size = 10;
    static speed = {x: .5, y: .5};

    constructor({position, canvas}) {
        this.position = position;
        this.canvas = canvas;
        this.direction = {x: 0.5, y: 0.5};
    }

    draw(context) {
        context.fillStyle = Theme.ballcolor;
        context.fillRect(this.position.x - Ball.size / 2, this.position.y - Ball.size / 2, Ball.size, Ball.size);
    }

    move(deltaTime) {
        const velocity = {
            x: Ball.speed.x * this.direction.x * deltaTime,
            y: Ball.speed.y * this.direction.y * deltaTime,
        };

        this.position.x += velocity.x;
        this.position.y += velocity.y;
    }
}

export default Ball;
