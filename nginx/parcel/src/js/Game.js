import Player from './Player.js';
import Ball from './Ball.js';
import Banner from './Banner.js';
import TerminalPage from './TerminalPage.js';
import Theme from './Theme.js';
import { setPage, localize } from './util.js';

const template = document.createElement('template');
template.innerHTML = `
    <canvas id='pong'></canvas>
    <input type="text" maxLength="1" style="width: 0; overflow: hidden; outline: none; margin: 0; padding: 0; border: 0"/>
`;

class Game extends HTMLElement {
    static maxScore = 3;
    constructor(tournament) {
        super();

        this.appendChild(template.content.cloneNode(true));
        this.canvas = this.querySelector('canvas');
        this.input = this.querySelector('input');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext('2d');
        this.tournament = tournament;

        const initialPlayerY = (this.canvas.height - Player.height) / 2;

        this.player1 = new Player({
            name: tournament.players[0],
            position: {
                x: 0,
                y: initialPlayerY,
            },
            canvas: this.canvas,
        });

        this.player2 = new Player({
            name: tournament.players[1],
            position: {
                x: this.canvas.width - Player.width,
                y: initialPlayerY,
            },
            canvas: this.canvas,
        });

        this.ball = new Ball({
            position: {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
            },
        });
    }

    draw(context) {
        context.fillStyle = Theme.bgcolor;
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.player1.draw(context);
        this.player2.draw(context);
        this.ball.draw(context);

        context.fillStyle = Theme.scorecolor;
        context.font = '40px Arial';

        context.textAlign = 'right';
        context.fillText(this.player1.score, this.canvas.width / 2 - 100, this.canvas.height / 2);

        context.textAlign = 'left';
        context.fillText(this.player2.score, this.canvas.width / 2 + 100, this.canvas.height / 2);
    }

    move(deltaTime) {
        this.player1.move(deltaTime);
        this.player2.move(deltaTime);
        this.ball.move(deltaTime);

        if (this.ball.position.y <= 0 || this.ball.position.y >= this.canvas.height) {
            this.ball.direction.y = -this.ball.direction.y;
        }

        if (this.ball.position.x <= Player.width) {
            if (this.ball.position.y > this.player1.position.y &&
                this.ball.position.y < this.player1.position.y + Player.height)
            {
                this.ball.direction.x = -this.ball.direction.x;
            }
            else {
                this.player2.score++;
                this.resetBall();
            }
        }

        if (this.ball.position.x >= this.canvas.width - Player.width) {
            if (this.ball.position.y > this.player2.position.y &&
                this.ball.position.y < this.player2.position.y + Player.height)
            {
                this.ball.direction.x = -this.ball.direction.x;
            }
            else {
                this.player1.score++;
                this.resetBall();
            }
        }

        if (this.player1.score === Game.maxScore || this.player2.score === Game.maxScore) {
            this.onEnd();
        }
    }

    resetBall() {
        this.ball.position.x = this.canvas.width / 2;
        this.ball.position.y = this.canvas.height / 2;
        this.ball.direction.x = -this.ball.direction.x;
        this.ball.direction.y = 0.5;
    }

    update() {
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        this.move(deltaTime);
        this.draw(this.context);
    }

    connectedCallback() {
        this.onKeydown = (({key, repeat}) => {
            if (repeat)
                return;
            switch (key) {
                case 'w': this.player1.moveUp = true;
                    break;
                case 's': this.player1.moveDown = true;
                    break;
                case 'W': this.player1.moveUp = true;
                    break;
                case 'S': this.player1.moveDown = true;
                    break;
                case 'ArrowUp': this.player2.moveUp = true;
                    break;
                case 'ArrowDown': this.player2.moveDown = true;
                    break;
            }
        }).bind(this);

        this.onKeyup = (({key, repeat}) => {
            switch (key) {
                case 'w': this.player1.moveUp = false;
                    break;
                case 's': this.player1.moveDown = false;
                    break;
                case 'W': this.player1.moveUp = false;
                    break;
                case 'S': this.player1.moveDown = false;
                    break;
                case 'ArrowUp': this.player2.moveUp = false;
                    break;
                case 'ArrowDown': this.player2.moveDown = false;
                    break;
            }
        }).bind(this);

        this.input.addEventListener('blur', () => {
            this.input.focus();
        });

        this.input.focus();
        this.input.addEventListener('keyup', this.onKeyup);
        this.input.addEventListener('keydown', this.onKeydown);

        this.lastUpdate = Date.now();
        this.interval = setInterval(this.update.bind(this), 0);
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }

    announceAndStart() {
        setPage(new Banner({
            text: localize({
                en: `Prepare for the match! Right side ${this.tournament.players[0]} vs ${this.tournament.players[1]} left side. Press ENTER KEY when ready.\n`,
                fi: `Valmistaudu otteluun! Oikealla ${this.tournament.players[0]} vs ${this.tournament.players[1]} vasemmalla. Paina ENTER-näppäintä, kun olet valmis.\n`,
                vn: `Chuẩn bị cho trận đấu! Ở bên phải ${this.tournament.players[0]} vs ${this.tournament.players[1]} ở bên trái. Nhấn phím ENTER khi bạn đã sẵn sàng.\n`,
            }),
            onContinue: () => {
                setPage(this);
            },
        }));
    }

    announceWinner({winner, onContinue}) {
        setPage(new Banner({
            text: localize({
                en: `${winner} IS THE BIG TIME WINNER!\n Make sure to congratulate the winner!\nPress ENTER KEY to continue...\n`,
                fi: `${winner} ON SUURI VOITTAJA!\n Muista onnitella voittajaa!\nPaina ENTER-näppäintä jatkaaksesi...\n`,
                vn: `${winner} LÀ NGƯỜI THẮNG LỚN! Nhớ chúc mừng người chiến thắng! Nhấn phím ENTER để tiếp tục...\n`,
            }),
            onContinue: onContinue,
        }));
    }

    onEnd() {
        const [loser, winner] = [this.player1, this.player2].sort((a, b) => a - b);
        this.tournament.removePlayer(loser.name);
        if (this.tournament.players.length === 1) {
            this.announceWinner({
                winner: winner.name,
                onContinue: () => {
                    setPage(new Banner({
                        text: localize({
                            en: `Playtime is over!\n Press ENTER KEY to exit game mode...\n`,
                            fi: `Peliaika on päättynyt!\n Paina ENTER-näppäintä poistuaksesi pelitilasta...\n`,
                            vn: `Thời gian chơi đã kết thúc!\n Nhấn phím ENTER để thoát khỏi trạng thái trò chơi...\n`,
                        }),
                        onContinue: () => {
                            setPage(new TerminalPage());
                        },
                    }))

                },
            });
        }
        else {
            this.announceWinner({
                winner: winner.name,
                onContinue: () => {
                    const game = new Game(this.tournament);
                    game.announceAndStart();
                },
            });
        }
    }

}

window.customElements.define('ft-game', Game);

export default Game;
