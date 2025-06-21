import { initCamera, updateCamera,updateCameraToBounds, transform, camera } from './modules/camera.js';
import { rocket, initRocket, updateRocket, drawRocket, createExhaustParticles } from './modules/rocket.js';
import { createPolygons, drawPolygons } from './modules/polygon.js';
import { createStars, drawStars } from './modules/stars.js';
import { particles, createParticles, updateParticles, drawParticles } from './modules/particles.js';
import { initControls, keys } from './modules/controls.js';
import { checkCollisions } from './modules/collision.js';
import { resizeCanvas } from './modules/utils.js';
import { bgColor } from './modules/colors.js';

// Initialize canvas
const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');

// Set canvas dimensions to window size
window.addEventListener('resize', () => resizeCanvas(canvas));
resizeCanvas(canvas);

// Initialize game objects
initRocket();
const levels = createPolygons();
let currentLevel = 0;
const stars = createStars(300, 4000);
initCamera(canvas.width, canvas.height, rocket);
initControls();

// Game state
let gameRunning = false;
let lastTimestamp = 0;
startGame();
// Start game
startButton.addEventListener('click', () => {
    if (!gameRunning) {
       // startGame();
    } else {
    	//resetGame();       
    }
});

function startGame(){
	gameRunning = true;
        startButton.textContent = 'Restart Level';
        rocket.score = 0;
        scoreElement.textContent = rocket.score;
        lastTimestamp = performance.now();
        requestAnimationFrame(gameLoop);
}
function resetGame(){
        //gameRunning = true;
	    rocket.x = 2000;
        rocket.y = 900;
        rocket.mx = 0;
        rocket.my = 0;
        rocket.rotation = 0;
        rocket.score = 0;
        particles.length = 0;
        scoreElement.textContent = rocket.score;
        lastTimestamp = performance.now();
}

function crashed(){
    gameRunning = false;
    startButton.textContent = 'Restart Level';
     // Show custom modal instead of alert
    const modal = document.getElementById('level-modal');
    const message = document.getElementById('level-modal-message');
    message.textContent = `Crashed!`;
    modal.style.display = 'flex';

    // Only reset when OK is clicked
    const okBtn = document.getElementById('level-modal-ok');
    okBtn.onclick = () => {
        modal.style.display = 'none';
        resetGame
        startGame();
    };
}

// Game loop
function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    // Update game state
    updateRocket(keys, deltaTime);
    updateCameraToBounds(levels,currentLevel,rocket,canvas);
    //updateCamera(rocket);
    createExhaustParticles(rocket, particles);
    updateParticles(particles);
    
    // Check collisions
    checkCollisions(rocket, levels[(currentLevel+1)%levels.length], particles, scoreElement,crashed,levelWon);
    
    // Increase score over time
    rocket.score += deltaTime * 0.001;
    scoreElement.textContent = Math.floor(rocket.score);
    
    // Render
    render();
    
    requestAnimationFrame(gameLoop);
}

// Render function
function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transforms
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply camera scale and translation
    ctx.setTransform(
        camera.scale, 0, 0, camera.scale,
        -camera.x * camera.scale,
        -camera.y * camera.scale
    );

    // Draw everything in world coordinates
    drawPolygons(levels[(currentLevel+1)%levels.length], ctx);
    drawParticles(particles, ctx);
    drawRocket(ctx);
}

function levelWon() {
    gameRunning = false;
    startButton.textContent = 'Next Level';
    // Show custom modal instead of alert
    const modal = document.getElementById('level-modal');
    const message = document.getElementById('level-modal-message');
    message.textContent = `Level won! Your score: ${Math.floor(rocket.score)}`;
    modal.style.display = 'flex';

    // Only reset when OK is clicked
    const okBtn = document.getElementById('level-modal-ok');
    okBtn.onclick = () => {
        modal.style.display = 'none';
        currentLevel++;
        resetGame();
    };
}
