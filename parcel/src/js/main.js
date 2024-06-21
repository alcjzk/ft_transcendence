import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', function() {
    initConfetti();
});

function initConfetti() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1';
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    for (let i = 0; i < 1000; i++) {
        const x = THREE.MathUtils.randFloatSpread(window.innerWidth);
        const y = THREE.MathUtils.randFloatSpread(window.innerHeight);
        const z = THREE.MathUtils.randFloatSpread(200);

        vertices.push(x, y, z);

        const color = new THREE.Color();
        color.setHSL(Math.random(), 1.0, 0.5);
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 5, vertexColors: true });
    const points = new THREE.Points(geometry, material);

    scene.add(points);

    camera.position.z = 500;

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.x += 0.005;
        points.rotation.y += 0.005;
        renderer.render(scene, camera);
    }

    animate();
}

let language = 'en';
let commandHistory = [];
let historyIndex = -1;
let player1 = '';
let player2 = '';
let gameOwner = 'MIKE';
let tournamentPlayers = [];
let gameInterval = null;
let maxLines  = 35;
let tournamentPlayerCount = 0;
let tournamentNamesGathered = 0;
let mode = 0;
const modeTerminal = 0;
const modeGameCreation = 1;
const modeGame = 2;
const modeNextMatch = 3;
const modeBetweenGames = 4;

document.addEventListener('keydown', function(event) {
    switch (mode) {
        case modeTerminal:
            handleTerminalInput(event);
            break;
        case modeGameCreation:
            handleGameCreation(event);
            break;
        case modeGame:
            handleGameInput(event);
            break;
        case modeNextMatch:
            handleNextMatch(event);
            break;
        case modeBetweenGames:
            handeBetweenGames(event);
            break;
        default:
            return;
    }
});

function handeBetweenGames(event) {
    if (event.key === 'Enter') {
        printBigTimeWinner();
        tournamentPlayers = [];
        mode = modeTerminal;
        return;
    }
    else 
        document.getElementById('input').value = '';
}

function handleNextMatch(event) {
    if (tournamentPlayers.length === 1) {
        printTournamentEnded();
        mode = modeBetweenGames;
        return;
    }
    player1 = tournamentPlayers[0];
    player2 = tournamentPlayers[1];
    printPrepareMatch(player1, player2);
    mode = modeGame;
}

function generateTerminalHistory() {
    let retValue = '';
    let historyIndexCopy = commandHistory.length;
    if (historyIndexCopy < maxLines)
        for (let i = 0; i < historyIndexCopy; i++)
            retValue += commandHistory[i] + '\n';
    else
        for (let i = historyIndexCopy - maxLines; i < historyIndexCopy; i++)
            retValue += commandHistory[i] + '\n';
    return retValue;
}

function handleGameInput(event) {
    if (event.key === 'Enter')
        setupPongGame(player1, player2);
}

function shufflePlayers() {
    for (let i = tournamentPlayerCount - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tournamentPlayers[i], tournamentPlayers[j]] = [tournamentPlayers[j], tournamentPlayers[i]];
    }
}

function handleGameCreation(event) {
    if (event.key === 'Enter') {
        let input = document.getElementById('input').value;
        input = input.toUpperCase();
        if (tournamentNamesGathered !== tournamentPlayerCount) {
            if (input === '' || tournamentPlayers.includes(input))
                return;
            tournamentPlayers.push(input);
            printPlayerRegistered(input);
            document.getElementById('input').value = '';
            tournamentNamesGathered++;
            if (tournamentNamesGathered === tournamentPlayerCount) {
                shufflePlayers();
                handleNextMatch(0);
            }
        }
    }
    return;
}

function printPlayerRegistered(input) {
    if (language === 'en')
        document.getElementById('output').innerText += 'Player registered: ' + input + '\n';
    if (language === 'fi')
        document.getElementById('output').innerText += 'Pelaaja rekisteröity: ' + input + '\n';
}

function printWhoAmI() {
    if (language === 'en')
        document.getElementById('output').innerText = `How exactly did you forget who you are....\nClassic ${gameOwner} moment...\nPress ANY KEY to continue...`;
    if (language === 'fi')
        document.getElementById('output').innerText = `Miten tarkalleen ottaen unohdit kuka olet....\nKlassinen ${gameOwner} hetki...\nPaina MITÄ TAHANSA NÄPPÄINTÄ jatkaaksesi...`;
}

function printInfo() {
    document.getElementById('output').innerText = 'Trancendence is the final project of the 42 curriculum!\nTo pass you need 7 major modules.\nTwo minor modules equate to one major module.\nWe have done the following modules:....\nPress ANY KEY to continue...';
}

function printAbout() {
    if (language === 'en')
        document.getElementById('output').innerText = 'Our team members are as followed:\nDean Ruina druina, Writer\'s soul\nLuis Sileoni lsileoni, Writer\'s soul\nTuomas Jääsalo tjaasalo\nMichail Karatzidis mkaratzi, Hand of Hive\nPress ANY KEY to continue...';
    if (language === 'fi')
        document.getElementById('output').innerText = 'Tiimimme jäsenet ovat seuraavat:\nDean Ruina druina, Writer\'s soul\nLuis Sileoni lsileoni, Writer\'s soul\nTuomas Jääsalo tjaasalo\nMichail Karatzidis mkaratzi, Hand of Hive\nPaina MITÄ TAHANSA NÄPPÄINTÄ jatkaaksesi...';
}

function printRandomQuote() {
    if (language === 'en')
        document.getElementById('output').innerText = 'Insanity is doing the same thing over and over expecting different results!\nPress ANY KEY to continue...';
    if (language === 'fi')
        document.getElementById('output').innerText = 'Hulluus on sitä, että tekee saman asian uudestaan ja uudestaan odottaen eri tuloksia!\nPaina MITÄ TAHANSA NÄPPÄINTÄ jatkaaksesi...';
}

function printHelp() {
    if (language === 'en')
        document.getElementById('output').innerText = 'We are currently supporting the following commands:\nplay - play 1vs1 vs a friend, the player on the left uses \'w\' and \'s\' to move and the player on the right his up and down arrows\ninfo - prints the relevant details about this project including modules done\nabout - prints information about the team members\nrandomquote - prints a random quote\nhelp - prints help/instructions for the user\nwhoami - prints users username\nlogout - logs user out of the game\nPress ANY KEY to continue...';
    if (language === 'fi')
        document.getElementById('output').innerText = 'Tällä hetkellä tuemme seuraavia komentoja:\nplay - pelaa 1vs1 kaveria vastaan, vasemmanpuoleinen pelaaja käyttää \'w\' ja \'s\' liikkuakseen ja oikeanpuoleinen pelaaja käyttää ylös- ja alasnuolia\ninfo - tulostaa tähän projektiin liittyvät tiedot, mukaan lukien suoritetut moduulit\nabout - tulostaa tietoja tiimin jäsenistä\nrandomquote - tulostaa satunnaisen lainauksen\nhelp - tulostaa käyttäjälle apua/ohjeita\nwhoami - tulostaa käyttäjän käyttäjätunnuksen\nlogout - kirjaa käyttäjän ulos pelistä\nPaina MITÄ TAHANSA NÄPPÄINTÄ jatkaaksesi...';
}

function printInvalidLanguageSelected() {
    if (language === 'en')
        document.getElementById('output').innerText += 'Invalid language selected. Use "langswap fi" for Finnish or "langswap en" for English.\n Press ANY KEY to continue...';
    if (language === 'fi')
        document.getElementById('output').innerText += 'Virheellinen kieli valittu. Käytä "langswap fi" suomeksi tai "langswap en" englanniksi.\n Paina MITÄ TAHANSA NÄPPÄINTÄ jatkaaksesi...';
}

function printInvalidTournament() {
    if (language === 'en')
        document.getElementById('output').innerText += 'Invalid tournament. Use "tournament <number_of_players>".\n Press ANY KEY to continue...';
    if (language === 'fi')
        document.getElementById('output').innerText += 'Virheellinen turnaus. Käytä "tournament <pelaajien_määrä>".\n Paina MITÄ TAHANSA NÄPPÄINTÄ jatkaaksesi...';
}

function printBigTimeWinner() {
    if (language === 'en')
        document.getElementById('output').innerText = tournamentPlayers[0] + ' IS THE BIG TIME WINNER!\n Make sure to congratulate the winner!\nPress ANY KEY to go back to the terminal...\n';
    if (language === 'fi')
        document.getElementById('output').innerText = tournamentPlayers[0] + ' ON SUURI VOITTAJA!\n Muista onnitella voittajaa!\nPaina MITÄ TAHANSA NÄPPÄINTÄ palataksesi takaisin päätelaitteeseen...\n';
}

function printTournamentEnded() {
    if (language === 'en')
        document.getElementById('output').innerText += 'The tournament has ended!\n Press ENTER KEY to exit game mode...\n';
    if (language === 'fi')
        document.getElementById('output').innerText += 'Turnaus on päättynyt!\n Paina ENTER-näppäintä poistuaksesi pelitilasta...\n';
}

function printPrepareMatch(player1, player2) {
    if (language === 'en')
        document.getElementById('output').innerText += `Prepare for the match: ${player1} vs ${player2}. Press ENTER KEY when ready.\n`;
    if (language === 'fi')
        document.getElementById('output').innerText += `Valmistaudu otteluun: ${player1} vs ${player2}. Paina ENTER-näppäintä, kun olet valmis.\n`;
}

function handleTerminalInput(event) {
    let inputField = event.target;
    if (event.key === 'Enter') {
        input = document.getElementById('input').value;
        input = input.toLowerCase();
        if (input === '') {
            document.getElementById('output').innerText = generateTerminalHistory();
            return;
        }
        commandHistory.push(input);
        historyIndex = commandHistory.length;
        document.getElementById('input').value = '';
        switch (input) {
            case 'play':
                startTournament(2);
                return;
            case 'info':
                printInfo();
                return;
            case 'about':
                printAbout();
                return;
            case 'randomquote':
                printRandomQuote();
                return;
            case 'help':
                printHelp();
                return;
            case 'whoami':
                printWhoAmI();
                return;
            case 'logout':
                return;
            default:
                break;
        }
        if (input.toLowerCase().startsWith('tournament')) {
            let parts = input.split(' ');
            if (parts.length === 2 && !isNaN(parts[1]) && parseInt(parts[1]) >= 2) {
                tournamentPlayerCount = parseInt(parts[1]);
                startTournament(tournamentPlayerCount);
                return;
            } else {
                document.getElementById('output').innerHTML = '';
                printInvalidTournament();
                return;
            }
        } else if (input.toLowerCase().startsWith('langswap')) {
            let parts = input.split(' ');
            if (parts.length === 2 && (parts[1] === 'fi' || parts[1] == 'en')) {
                language = parts[1];
            } else {
                document.getElementById('output').innerHTML = '';
                printInvalidLanguageSelected();
                return;
            }
        }
    } else if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            inputField.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputField.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            inputField.value = '';
        }
    }
    document.getElementById('output').innerText = generateTerminalHistory();
}

function startTournament(numPlayers) {
    tournamentPlayers.push(gameOwner); // Initialize with Player 1
    tournamentNamesGathered = 1;
    tournamentPlayerCount = numPlayers;
    document.getElementById('output').innerText = '';
    if (language === 'en')
        document.getElementById('output').innerText += 'Enter names for the remaining ' + (numPlayers - 1) + ' players:\n';
    if (language === 'fi')
        document.getElementById('output').innerText += 'Syötä jäljellä olevien ' + (numPlayers - 1) + ' pelaajan nimet:\n';
    mode = modeGameCreation;
}

function setupPongGame(player1, player2) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    document.getElementById('terminal').style.display = 'none';

    let player1Score = 0;
    let player2Score = 0;
    const maxScore = 3;

    const paddleWidth = 10;
    const paddleHeight = 100;
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    const paddleSpeed = 30;

    const ballSize = 10;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 8;
    let ballSpeedY = 8;
    mode = 42;

    function draw() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
        
        ctx.fillStyle = 'yellow';
        ctx.font = '40px Arial';
        ctx.fillText(player1Score, canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(player2Score, canvas.width / 2 + 100, canvas.height / 2);

        ctx.fillStyle = 'blue';
        ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
    }

    function move() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY <= 0 || ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX <= paddleWidth) {
            if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                player2Score++;
                resetBall();
            }
        }

        if (ballX >= canvas.width - paddleWidth) {
            if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                player1Score++;
                resetBall();
            }
        }

        if (player1Score === maxScore || player2Score === maxScore) {
            endGame(player1, player2, player1Score, player2Score);
        }
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
        ballSpeedY = 5;
    }

    function endGame(player1, player2, player1Score, player2Score) {
        const winner = player1Score === maxScore ? player1 : player2;
        const loser =  player2Score === maxScore ? player1 : player2;
        tournamentPlayers = tournamentPlayers.filter(item => item !== loser);
        clearInterval(gameInterval);

        document.body.removeChild(canvas);
        document.getElementById('terminal').style.display = 'flex';
        if (language === 'en')
            document.getElementById('output').innerText = `${winner} won!\n`;
        if (language === 'fi')
            document.getElementById('output').innerText = `${winner} voitti!\n`;
        handleNextMatch(1);
    }

    function gameLoop() {
        draw();
        move();
    }

    gameInterval = setInterval(gameLoop, 1000 / 60);

    window.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'w':
                paddle1Y = Math.max(paddle1Y - paddleSpeed, 0);
                break;
            case 's':
                paddle1Y = Math.min(paddle1Y + paddleSpeed, canvas.height - paddleHeight);
                break;
            case 'ArrowUp':
                paddle2Y = Math.max(paddle2Y - paddleSpeed, 0);
                break;
            case 'ArrowDown':
                paddle2Y = Math.min(paddle2Y + paddleSpeed, canvas.height - paddleHeight);
                break;
        }
    });
}
