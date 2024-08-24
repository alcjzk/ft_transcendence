class Tournament {
    constructor() {
        this.players = [];
    }

    addPlayer(name) {
        if (name === '' || this.players.includes(name))
            return false;
        this.players.push(name);
        return true;
    }

    removePlayer(name) {
        this.players = this.players.filter(item => item !== name);
    }

    shufflePlayers() {
        for (let i = this.players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
        }
    }
}

export default Tournament;
