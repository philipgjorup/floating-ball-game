const ball = document.getElementById('ball'); // Changed from bird to ball
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');

let ballY = 250; // Initial vertical position of the ball
let gravity = 2.8; // Gravity effect
let isGameOver = false; // Game over flag
let isPaused = false; // Pause flag
let score = 0; // Player's score
let pipeInterval; // Interval for pipes
let pipeSpeed = 2000; // Initial speed for pipe creation

// Function to start the game
function startGame() {
    if (isPaused || isGameOver) return;

    ballY += gravity; // Apply gravity to ball
    ball.style.top = ballY + 'px'; // Update ball's position

    if (ballY + ball.clientHeight >= gameArea.clientHeight) {
        endGame(); // End game if ball hits the ground
    }

    // Check for collision with pipes
    checkCollision();
}

// Function to make the ball flap
function flap() {
    if (isGameOver || isPaused) return;

    ballY -= 40; // Move the ball up when flapping
}

// Function to create pipes with random sizes and a single color
function createPipe() {
    const pipeHeight = Math.random() * (gameArea.clientHeight - 150) + 30; // Random height for upper pipe
    const pipeGap = 200; // Increased gap between upper and lower pipes

    const color = Math.random() < 0.5 ? 'green' : 'red'; // Randomly assign one color

    const upperPipe = document.createElement('div');
    const lowerPipe = document.createElement('div');

    upperPipe.classList.add('pipe');
    lowerPipe.classList.add('pipe');

    upperPipe.style.width = '50px';
    upperPipe.style.height = pipeHeight + 'px';
    
   lowerPipe.style.width = '50px';
   lowerPipe.style.height = (gameArea.clientHeight - pipeHeight - pipeGap) + 'px'; 

   upperPipe.style.backgroundColor = color; // Set the same color for both pipes
   lowerPipe.style.backgroundColor = color;

   upperPipe.style.left = lowerPipe.style.left = '400px'; // Position pipes off-screen initially

   gameArea.appendChild(upperPipe);
   gameArea.appendChild(lowerPipe);

   movePipes(upperPipe, lowerPipe);
}

// Function to move pipes across the screen
function movePipes(upperPipe, lowerPipe) {
   const moveInterval = setInterval(() => {
       const pipeLeft = parseInt(upperPipe.style.left);

       if (pipeLeft <= -50) { // Remove pipes when they go off-screen
           clearInterval(moveInterval);
           upperPipe.remove();
           lowerPipe.remove();
           score++; // Increment score when pipes go off-screen

           // Update score display and increase difficulty every 5 points
           scoreDisplay.innerText = 'Score: ' + score;
           if (score % 5 === 0 && score < 100) {
               increaseDifficulty();
           }

           if (score >= 100) {
               endGame(); // End game when score reaches 100
           }
       } else {
           upperPipe.style.left = (pipeLeft - (5 + Math.floor(score / 10))) + 'px'; // Move pipes left, increase speed based on score
           lowerPipe.style.left = (pipeLeft - (5 + Math.floor(score / 10))) + 'px'; // Move pipes left, increase speed based on score
       }
   }, 20);
}

// Function to increase difficulty by decreasing pipe creation interval
function increaseDifficulty() {
   if (pipeSpeed > 1000) { // Minimum speed limit for pipes
       pipeSpeed -= 200; // Decrease interval by 200ms
       clearInterval(pipeInterval); 
       pipeInterval = setInterval(createPipe, pipeSpeed); // Restart with new speed
   }
}

// Function to check for collisions with pipes
function checkCollision() {
   const pipes = document.querySelectorAll('.pipe');

   pipes.forEach(pipe => {
       const pipeRect = pipe.getBoundingClientRect();
       const ballRect = ball.getBoundingClientRect(); 

       if (
           ballRect.x < pipeRect.x + pipeRect.width &&
           ballRect.x + ballRect.width > pipeRect.x &&
           ballRect.y < pipeRect.y + pipeRect.height &&
           ballRect.y + ballRect.height > pipeRect.y
       ) {
           endGame(); // End game on collision
       }
   });
}

// Function to end the game
function endGame() {
   isGameOver = true;
   clearInterval(pipeInterval); // Stop creating new pipes
   alert("Game Over! Your score was " + score);
}

// Function to reset the game state
function resetGame() {
   isGameOver = false;
   isPaused = false;
   score = 0;
   scoreDisplay.innerText = 'Score: 0';
   ballY = 250;
   ball.style.top = ballY + 'px';
   document.querySelectorAll('.pipe').forEach(pipe => pipe.remove()); // Remove existing pipes

   // Restart pipe creation interval with initial speed
   pipeSpeed = 2000;
   pipeInterval = setInterval(createPipe, pipeSpeed); 
}

// Event listeners for flapping and starting/pausing the game with Enter key
window.addEventListener('keydown', event => {
   if (event.code === 'Enter') { 
       if (isGameOver) {
           resetGame();
       } else {
           isPaused = !isPaused; 
       }
   }

   if (!isPaused && event.code === 'ArrowUp') { 
       flap(); 
   }

   if (!isPaused && event.code === 'ArrowDown') { 
       ballY += 10; // Move down slightly when pressing down arrow key
       if (ballY > gameArea.clientHeight - ball.clientHeight) {
           endGame(); 
       }
       ball.style.top = ballY + 'px'; 
   }
});

// Touch controls for mobile devices
gameArea.addEventListener('touchstart', function(event) {
    event.preventDefault(); // Prevent scrolling on touch devices.
    flap(); // Flap when the screen is touched.
});

// Start creating pipes at intervals and start the game loop
pipeInterval = setInterval(createPipe, 2000); 
setInterval(startGame, 20); 