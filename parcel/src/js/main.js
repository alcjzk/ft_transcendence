import * as THREE from 'three';

let commandHistory = [];
let historyIndex = -1;
let player1 = ''
let player2 = '';
let gameOwner = 'MIKE'
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

document.addEventListener('keydown', function(event) {
    switch (mode){
        case modeTerminal:
            handleTerminalInput(event);
            break ;
        case modeGameCreation:
            handleGameCreation(event);
            break ;
        case modeGame:
            handleGameInput(event);
            break ;
        case modeNextMatch:
            handleNextMatch(event);
            break ;
        default:
            return ;
    };
});

function handleNextMatch(event)
{
    if (tournamentPlayers.length === 1) {
        document.getElementById('output').innerText += '\n' + tournamentPlayers[0] + ' IS THE BIG TIME WINNER!\n Press ANY KEY to exit game mode...\n';
        //celebrateWinner();
        mode = modeTerminal;
        tournamentPlayers = [];
        return;
    }
    player1 = tournamentPlayers[0];
    player2 = tournamentPlayers[1];
    document.getElementById('output').innerText += `Prepare for the match: ${player1} vs ${player2}. Press ANY KEY when ready.\n` ;
    mode = modeGame;
}

function generateTerminalHistory()
{
    let retValue = '';
    let historyIndexCopy = commandHistory.length;
    if (historyIndexCopy < maxLines)
        for (let i = 0; i < historyIndexCopy; i++)
            retValue  += commandHistory[i] + '\n';
    else
        for (i = historyIndexCopy - maxLines; i < historyIndexCopy; i++)
            retValue  += commandHistory[i] + '\n';
    return retValue;
}

function handleGameInput(event){
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
        if (tournamentNamesGathered !== tournamentPlayerCount){
            if (input === '' || tournamentPlayers.includes(input))
                return ;
            tournamentPlayers.push(input);
            document.getElementById('output').innerText += 'Player registered: ' + input + '\n';
            document.getElementById('input').value = '';
            tournamentNamesGathered++;
            if (tournamentNamesGathered === tournamentPlayerCount){
                shufflePlayers();
                handleNextMatch(0);
                }
        }
    }
    return ;
}

function printWhoAmI(){
    document.getElementById('output').innerText = 'How exactly did you forget who you are....\nClassic ${gameOwner} moment...\nPress ANY KEY to continue...';
}

function printInfo(){
    document.getElementById('output').innerText = 'Trancendence is the final project of the 42 curriculum!\nTo pass you need 7 major modules.\nTwo minor modules equate to one major module.\nWe have done the following modules:....\nPress ANY KEY to continue...';
}

function printAbout(){
    document.getElementById('output').innerText = 'Our team members are as followed:\n|TEAM NAMES HERE|\nPress ANY KEY to continue...';
}

function printRandomQuote(){
    document.getElementById('output').innerText = 'Insanity is doing the same thing over and over expecting different results!\nPress ANY KEY to continue...';
}

function printHelp(){
    document.getElementById('output').innerText = 'We are currently supporting the following commands:\n|LIST COMMANDS HERE|\nPress ANY KEY to continue...';
}

function handleTerminalInput(event) {
    let inputField = event.target;
    if (event.key === 'Enter') {
        input = document.getElementById('input').value;
        input = input.toLowerCase();
        if(input === ''){
            document.getElementById('output').innerText = generateTerminalHistory();
            return ;
        }    
        commandHistory.push(input);
        historyIndex = commandHistory.length;
        document.getElementById('input').value = '';
        switch (input){
            case '/play':
                startTournament(2);
                return ;
            case '/info':
                printInfo();
                return ;
            case '/about':
                printAbout();
                return ;
            case '/transcende':
                break ;
            case '/randomquote':
                printRandomQuote();
                return ;
            case '/help':
                printHelp();
                return ;
            case '/whoami':
                printWhoAmI();
                return ;
            case '/logout':
                return ;
            default:
                break ;
        }
        if (input.toLowerCase().startsWith('/tournament')) {
            let parts = input.split(' ');
            if (parts.length === 2 && !isNaN(parts[1]) && parseInt(parts[1]) >= 2) {
                 tournamentPlayerCount = parseInt(parts[1]);
                 startTournament(tournamentPlayerCount);
                 return ;
            } else {
                document.getElementById('output').innerHTML = '';
                document.getElementById('output').innerText += 'Invalid tournament. Use "tournament <number_of_players>".\n Press ANY KEY to continue...';
                return ;
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
    document.getElementById('output').innerText += 'Enter names for the remaining ' + (numPlayers - 1) + ' players:\n';
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
    const paddleSpeed = 10;

    const ballSize = 10;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
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
        document.getElementById('output').innerText = `${winner} won!\n`;
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



// Set up the scene, camera, and renderer
let scene, camera, renderer, confetti;
let confettiCount = 1000;
let confettiGeometry, confettiMaterial;

// Initialize the Three.js scene and confetti
function initConfetti() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera.position.z = 5;

  confettiGeometry = new THREE.BufferGeometry();
  const confettiPositions = new Float32Array(confettiCount * 3);
  const confettiColors = new Float32Array(confettiCount * 3);

  for (let i = 0; i < confettiCount; i++) {
    confettiPositions[i * 3] = (Math.random() - 0.5) * 10;
    confettiPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    confettiPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    confettiColors[i * 3] = Math.random();
    confettiColors[i * 3 + 1] = Math.random();
    confettiColors[i * 3 + 2] = Math.random();
  }

  confettiGeometry.setAttribute('position', new THREE.BufferAttribute(confettiPositions, 3));
  confettiGeometry.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3));

  confettiMaterial = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
  confetti = new THREE.Points(confettiGeometry, confettiMaterial);

  scene.add(confetti);

  animateConfetti();
}

// Animation loop
function animateConfetti() {
  requestAnimationFrame(animateConfetti);

  // Update confetti positions
  const positions = confetti.geometry.attributes.position.array;
  for (let i = 0; i < confettiCount; i++) {
    positions[i * 3 + 1] -= 0.02; // Move down

    if (positions[i * 3 + 1] < -5) {
      positions[i * 3 + 1] = 5; // Reset position when out of view
    }
  }
  confetti.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

// Function to start the confetti animation
function celebrateWinner() {
  initConfetti();
}

