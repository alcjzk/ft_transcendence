import Game from './Game.js';
import Tournament from './Tournament.js';
import Banner from './Banner.js';
import { setPage } from './util.js';

class TournamentPrompt {
    constructor(terminal, playerCount) {
        this.tournament = new Tournament();
        this.terminal = terminal;
        this.remainingPlayers = playerCount;

        this.prompt();
    }

    prompt() {
        this.terminal.printLocalized({
            en: `Enter names for the remaining ${this.remainingPlayers} players:`,
            fi: `Syötä jäljellä olevien ${this.remainingPlayers} pelaajan nimet:`,
        });
    }

    onInput(value) {
        const player = value.toUpperCase();
        if (!this.tournament.addPlayer(player))
        {
            if (player === ``)
                return ;
            else
                this.terminal.printLocalized({
                    en: `Player with the name ${player} is already registered.`,
                    fi: `Pelaaja ${player} on jo rekisteröity.`,
                });
            return ;
        }
        this.terminal.printLocalized({
            en: `Player registered: ${value}`,
            fi: `Pelaaja rekisteröity: ${value}`,
        });

        this.terminal.input.value = '';
        if (--this.remainingPlayers <= 0)
        {

            this.tournament.shufflePlayers();
            const game = new Game(this.tournament);
            game.announceAndStart();
        }
        else
            this.prompt();
    }
}

export default TournamentPrompt;
