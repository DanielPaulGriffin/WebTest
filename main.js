import { initCamera, updateCamera, transform } from './modules/camera.js';
import { rocket, initRocket, updateRocket, drawRocket, createExhaustParticles } from './modules/rocket.js';
import { createPolygons, drawPolygons } from './modules/polygon.js';
import { createStars, drawStars } from './modules/stars.js';
import { particles, createParticles, updateParticles, drawParticles } from './modules/particles.js';
import { initControls, keys } from './modules/controls.js';
import { checkCollisions } from './modules/collision.js';
import { resizeCanvas } from './modules/utils.js';

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
const polygons = createPolygons();
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
        startGame();
    } else {
    	resetGame();
        // Reset game
        //rocket.x = 2000;
        //rocket.y = 900;
       // rocket.mx = 0;
        //rocket.my = 0;
       //rocket.rotation = 0;
        //rocket.score = 0;
        //particles.length = 0;
        //scoreElement.textContent = rocket.score;
       // lastTimestamp = performance.now();
    }
});

function startGame(){
	gameRunning = true;
        startButton.textContent = 'Restart Game';
        rocket.score = 0;
        scoreElement.textContent = rocket.score;
        lastTimestamp = performance.now();
        requestAnimationFrame(gameLoop);
}
function resetGame(){
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

// Game loop
function gameLoop(timestamp) {
    if (!gameRunning) return;
    
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    // Update game state
    updateRocket(keys, deltaTime);
    updateCamera(rocket);
    createExhaustParticles(rocket, particles);
    updateParticles(particles);
    
    // Check collisions
    checkCollisions(rocket, polygons, particles, scoreElement);
    
    // Increase score over time
    rocket.score += deltaTime * 0.001;
    scoreElement.textContent = Math.floor(rocket.score);
    
    // Render
    render();
    
    requestAnimationFrame(gameLoop);
}

// Render function
function render() {
    // Clear screen with space gradient
    const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)
    );
    gradient.addColorStop(0, '#0f0c29');
    gradient.addColorStop(1, '#000000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game objects
    drawStars(stars,ctx);
    drawPolygons(polygons,ctx);
    drawParticles(particles,ctx);
    drawRocket(ctx);
}
