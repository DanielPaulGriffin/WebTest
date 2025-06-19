const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');

// Rocket properties
const rocket = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 30,
    height: 50,
    speed: 6,
    rotation: 0,
    thrust: false,
    score: 0
};

const keys = {};
const stars = createStars(100); // Background stars

// Input handling
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === 'ArrowUp') rocket.thrust = true;
});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
    if (e.key === 'ArrowUp') rocket.thrust = false;
});

startButton.addEventListener('click', () => {
    rocket.score++;
    scoreElement.textContent = rocket.score;
});

// Create starfield
function createStars(count) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5
    }));
}

// Draw rocket with rotation
function drawRocket() {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.rotation);
    
    // Rocket body
    ctx.fillStyle = '#FF4136';
    ctx.beginPath();
    ctx.moveTo(0, -rocket.height/2);
    ctx.lineTo(-rocket.width/2, rocket.height/2);
    ctx.lineTo(rocket.width/2, rocket.height/2);
    ctx.closePath();
    ctx.fill();
    
    // Rocket thrust effect
    if (rocket.thrust) {
        ctx.fillStyle = `hsl(${Math.random() * 20 + 30}, 100%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(-10, rocket.height/2);
        ctx.lineTo(0, rocket.height/2 + Math.random() * 10 + 20);
        ctx.lineTo(10, rocket.height/2);
        ctx.fill();
    }
    ctx.restore();
}

// Draw stars
function drawStars() {
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Update game state
function update() {
    // Rotation
    if (keys['ArrowLeft']) rocket.rotation -= 0.05;
    if (keys['ArrowRight']) rocket.rotation += 0.05;
    
    // Movement (direction-sensitive)
    if (keys['ArrowUp']) {
        rocket.x += Math.sin(rocket.rotation) * rocket.speed;
        rocket.y -= Math.cos(rocket.rotation) * rocket.speed;
    }
    
    // Boundaries (wrap around)
    if (rocket.x < -rocket.width) rocket.x = canvas.width + rocket.width;
    if (rocket.x > canvas.width + rocket.width) rocket.x = -rocket.width;
    if (rocket.y < -rocket.height) rocket.y = canvas.height + rocket.height;
    if (rocket.y > canvas.height + rocket.height) rocket.y = -rocket.height;
    
    // Move stars for parallax effect
    if (keys['ArrowUp']) {
        stars.forEach(star => {
            star.y += 2;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
    }
}

// Render everything
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawRocket();
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
