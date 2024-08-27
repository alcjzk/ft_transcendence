import TournamentPrompt from './TournamentPrompt.js';
import LoginPage from './LoginPage.js';
import Theme from './Theme.js';
import { isDigitString, setPage } from './util.js';

const TOURNAMENT_PLAYERS_MIN = 2;
const TOURNAMENT_PLAYERS_MAX = 5;

const commands = {
    chtheme: (commandPrompt, args) => {
        const command = args.at(0);
        const theme = args.at(1);
        if (!['cursed', 'space', 'prussian'].includes(theme))
        {
            commandPrompt.terminal.printLocalized({
                en: `Invalid theme selected. Options: cursed, space or prussian.\n`,
                fi: `Virheellinen teema valittu. Vaihtoehdot: cursed, space tai prussian.\n`,
            });
            return;
        }
        Theme.set(theme);
        commandPrompt.terminal.printLocalized({
            en: `Theme selected: ${theme}.\n`,
            fi: `Teema valittu: ${theme}.\n`,
        });
    },
    aboutus: commandPrompt => {
        commandPrompt.terminal.printLocalized({
            en: `Our team members are as follows:
                 Dean Ruina druina, writer's soul
                 Luis Sileoni lsileoni, writer's soul
                 Tuomas Jääsalo tjaasalo
                 Michail Karatzidis mkaratzi, hand of hive\n`,
                 
            fi: `Tiimimme jäsenet ovat seuraavat:
                 Dean Ruina druina, writer's soul
                 Luis Sileoni lsileoni, writer's soul
                 Tuomas Jääsalo tjaasalo
                 Michail Karatzidis mkaratzi, hand of hive`
        });
    },
    clear: commandPrompt => {
        commandPrompt.terminal.output.innerText = '';
    },
    randomquote: commandPrompt => {
        commandPrompt.terminal.printLocalized({
            en: `insanity is doing the same thing over and over expecting different results!\n`,
            fi: `hulluus on sitä, että tekee saman asian uudestaan ja uudestaan odottaen eri tuloksia!\n`,
        });
    },
    whoami: commandPrompt => {
        const name = sessionStorage.getItem('first_name');
        commandPrompt.terminal.printLocalized({
            en: `How exactly did you forget who you are....
                 Classic ${name} moment...\n`,

            fi: `Miten tarkalleen ottaen unohdit kuka olet....
                 Klassinen ${name} hetki...\n`,
        });
    },
    help: commandPrompt => {
        commandPrompt.terminal.printLocalized({
            en: `We are currently supporting the following commands:
                 play - play 1vs1 vs a friend, the player on the left uses 'w' and 's' to move and the player on the right his up and down arrows
                 info - prints the relevant details about this project including modules done
                 aboutus - prints information about the team members
                 randomquote - prints a random quote
                 help - prints help/instructions for the user
                 whoami - prints users username
                 clear - clears the terminal
                 chlang - change the language of the terminal
                 logout - logs user out of the game
                 chtheme - change game theme\n`,

            fi: `Tällä hetkellä tuemme seuraavia komentoja:
                 play - pelaa 1vs1 kaveria vastaan, vasemmanpuoleinen pelaaja käyttää 'w' ja 's' liikkuakseen ja oikeanpuoleinen pelaaja käyttää ylös- ja alasnuolia
                 info - tulostaa tähän projektiin liittyvät tiedot, mukaan lukien suoritetut moduulit
                 aboutus - tulostaa tietoja tiimin jäsenistä
                 randomquote - tulostaa satunnaisen lainauksen
                 help - tulostaa käyttäjälle apua/ohjeita
                 whoami - tulostaa käyttäjän käyttäjätunnuksen
                 clear - terminaali-ikkunan tyhjennys
                 chlang - terminaalikielen vaihto
                 logout - kirjaa käyttäjän ulos pelistä
                 chtheme - peliteeman vaihto\n`,
        });
    },
    info: commandPrompt => {
        commandPrompt.terminal.printLocalized({
            en: `Done modules:
                Major module: Microservices
                Major module: Elk stack
                Major module: Use framework as backend: Django
                Major module: Remote authentication
                Minor module: Language support
                Minor module: Database usage: Postgress
                Minor module: Frontend framework: Bootstrap
                Minor module: Monitoring system: Grafana
                Minor module: Browser support
                Minor module: Customization\n`,
            fi: `Tehdyt moduulit:
                Major module: Microservices
                Major module: Elk stack
                Major module: Use framework as backend: Django
                Major module: Remote authentication
                Minor module: Language support
                Minor module: Database usage: Postgress
                Minor module: Frontend framework: Bootstrap
                Minor module: Monitoring system: Grafana
                Minor module: Browser support
                Minor module: Customization\n`
        });
    },
    chlang: (commandPrompt, args) => {
        const command = args.at(0);
        const language = args.at(1);
        if (!['en', 'fi'].includes(language))
        {
            commandPrompt.terminal.printLocalized({
                en: `Invalid language selected. Use "${command} fi" for Finnish or "${command} en" for English.\n`,
                fi: `Virheellinen kieli valittu. Käytä "${command} fi" suomeksi tai "${command} en" englanniksi.\n`,
            });
            return;
        }
        sessionStorage.setItem('language', language);
        commandPrompt.terminal.printLocalized({
            en: `Language set to English.\n`,
            fi: `Kieli asetettu suomeksi.\n`,
        });
    },
    tournament: (commandPrompt, args) => {
        const command = args.at(0);
        const playerCount = (arg => {
            if (!isDigitString(arg))
                return null;
            const count = parseInt(arg);
            if (count < TOURNAMENT_PLAYERS_MIN || count > TOURNAMENT_PLAYERS_MAX)
                return null;
            return count;
        })(args.at(1));

        if (playerCount === null) {
            commandPrompt.terminal.printLocalized({
                en: `Invalid tournament. Use "tournament <number_of_players>".\n`,
                fi: `Virheellinen turnaus. Käytä "tournament <pelaajien_määrä>".\n`,
            });
        }
        else
            commandPrompt.terminal.prompt = new TournamentPrompt(commandPrompt.terminal, playerCount);
    },
    play: commandPrompt => {
        commandPrompt.terminal.prompt = new TournamentPrompt(commandPrompt.terminal, 2);
    },
    logout: CommandPrompt => {
        sessionStorage.removeItem('first_name');
        sessionStorage.removeItem('language');
        fetch('/auth/logout')
            .then(() => setPage(new LoginPage()));
    },
};

class CommandPrompt {
    static history = [''];

    constructor(terminal) {
        this.terminal = terminal;
        this.commands = commands;
        this.historyIndex = CommandPrompt.history.length - 1;
    }

    onInput(value) {
        if (value === '')
            return;
        const args = value.split(' ');
        const command = args.at(0);
        this.historyAdd(value);
        if (this.commands.hasOwnProperty(command))
        {
            this.terminal.print(`> ${value}`);
            this.commands[command].bind(this)(this, args);
        }
        else
        {
            this.terminal.print(`> ${value}`);
            this.terminal.printLocalized({
                en: `Sorry we do not support this command: ${command}
                Use the command \`help\` to find the commands we support.\n`,
                fi: `Pahoittelut, emme tue kommentoa: ${command}
                Saat listan tuetuista kommennoista \`help\` kommennolla.\n`
            })
        }
        this.historyIndex = CommandPrompt.history.length - 1;
        this.terminal.output.scrollTop = this.terminal.output.scrollHeight;
    }

    historyAdd(value) {
        CommandPrompt.history[CommandPrompt.history.length - 1] = value;
        CommandPrompt.history.push('');
    }

    onKeydown({key}) {
        switch (key) {
            case 'ArrowUp': this.historyPrevious();
                break;
            case 'ArrowDown': this.historyNext();
                break;
        }
    }

    historyPrevious() {
        this.historyIndex = Math.max(this.historyIndex - 1, 0);
        this.terminal.input.value = CommandPrompt.history[this.historyIndex];
        setTimeout(() => (this.terminal.input.selectionStart = 25), 0);
    }

    historyNext() {
        this.historyIndex = Math.min(this.historyIndex + 1, CommandPrompt.history.length - 1);
        this.terminal.input.value = CommandPrompt.history[this.historyIndex];
        setTimeout(() => (this.terminal.input.selectionStart = 25), 0);
    }
}

export default CommandPrompt;
