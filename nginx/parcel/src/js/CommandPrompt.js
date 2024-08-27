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
                vn: `Chủ đề không hợp lệ. Các tùy chọn: cursed, space hay la prussian.\n`,
            });
            return;
        }
        Theme.set(theme);
        commandPrompt.terminal.printLocalized({
            en: `Theme selected: ${theme}.\n`,
            fi: `Teema valittu: ${theme}.\n`,
            vn: `Chủ đề đã chọn: ${theme}.\n`,
        });
    },
    aboutus: commandPrompt => {
        commandPrompt.terminal.printLocalized({
            en: `Our team members are as follows:
                 Dean ruina druina, writer's soul
                 Luis sileoni lsileoni, writer's soul
                 Tuomas jääsalo tjaasalo
                 Michail karatzidis mkaratzi, hand of hive
                 Jonni le jole\n`,
                 
            fi: `Tiimimme jäsenet ovat seuraavat:
                 Dean ruina druina, writer's soul
                 Luis sileoni lsileoni, writer's soul
                 Tuomas jääsalo tjaasalo
                 Michail karatzidis mkaratzi, hand of hive
                 Jonni le jole\n`,

            vn: `Các thành viên trong nhóm của chúng tôi bao gồm:
                 Dean ruina druina, linh hồn nhà văn
                 Luis sileoni lsileoni, linh hồn nhà văn
                 Tuomas jääsalo tjaasalo
                 Michail karatzidis mkaratzi, bàn tay của tổ ong
                 Jonni le jole\n`,
          
        });
    },
    clear: commandPrompt => {
        commandPrompt.terminal.output.innerText = '';
    },
    randomquote: commandPrompt => {
        commandPrompt.terminal.printLocalized({
            en: `insanity is doing the same thing over and over expecting different results!\n`,
            fi: `hulluus on sitä, että tekee saman asian uudestaan ja uudestaan odottaen eri tuloksia!\n`,
            vn: `Điên rồ là làm cùng một việc lặp đi lặp lại và mong đợi kết quả khác biệt!\n`,
        });
    },
    whoami: commandPrompt => {
        const name = sessionStorage.getItem('first_name');
        commandPrompt.terminal.printLocalized({
            en: `How exactly did you forget who you are....
                 Classic ${name} moment...\n`,

            fi: `Miten tarkalleen ottaen unohdit kuka olet....
                 Klassinen ${name} hetki...\n`,

            vn: `Làm thế nào mà bạn lại quên chính xác mình là ai...
                 Khoảnh khắc thật là ${name} kinh điển...\n`,
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

            vn: `Hiện tại, chúng tôi hỗ trợ các lệnh sau:
                 play - chơi 1vs1 với bạn bè, người chơi bên trái sử dụng phím 'w' và 's' để di chuyển, người chơi bên phải sử dụng phím mũi tên lên và xuống
                 info - thông tin liên quan đến dự án này, bao gồm các module đã thực hiện
                 aboutus - thông tin về các thành viên trong nhóm
                 randomquote - một câu trích dẫn ngẫu nhiên
                 help - hướng dẫn/trợ giúp cho người dùng
                 whoami - tên người dùng
                 clear - xóa màn hình cửa sổ terminal
                 chlang - thay đổi ngôn ngữ của terminal
                 logout - đăng xuất người dùng khỏi trò chơ\n`,

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
                Minor module: Customization\n`,

            vn: `Các module đã thực hiện:
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

        });
    },
    chlang: (commandPrompt, args) => {
        const command = args.at(0);
        const language = args.at(1);
        if (!['en', 'fi', 'vn'].includes(language))
        {
            commandPrompt.terminal.printLocalized({
                en: `Invalid language selected. Use "${command} fi" for Finnish or "${command} en" for English or "${command} vn" for Vietnamese.\n`,
                fi: `Virheellinen kieli valittu. Käytä "${command} fi" suomeksi tai "${command} en" englanniksi tai "${command} vn" vietnamiksi.\n`,
                vn: `Ngôn ngữ không hợp lệ được chọn. Sử dụng "${command} fi" cho tiếng Phần Lan hoặc "${command} en" cho tiếng Anh" cho tiếng Việt hoặc "${command} vn" .\n`,
            });
            return;
        }
        sessionStorage.setItem('language', language);
        commandPrompt.terminal.printLocalized({
            en: `Language set to English.\n`,
            fi: `Kieli asetettu suomeksi.\n`,
            vn: `Ngôn ngữ đã được đặt thành tiếng Việt.\n`,
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
                vn: `Giải đấu không hợp lệ. Sử dụng "tournament <số_lượng_người_chơi>".\n`,
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
                Saat listan tuetuista kommennoista \`help\` kommennolla.\n`,
                vn: `Xin lỗi, chúng tôi không hỗ trợ lệnh: ${command}
                Bạn có thể xem danh sách các lệnh được hỗ trợ bằng lệnh \`help\`.\n`
            })
        }
        this.historyIndex = CommandPrompt.history.length - 1;
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
