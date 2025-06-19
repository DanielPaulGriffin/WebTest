// Initialize canvas to full screen
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');

// Set canvas dimensions to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rocket.x = canvas.width / 2;
    rocket.y = canvas.height / 2;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Rocket object
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
const stars = createStars(200);  // More stars for full screen
const particles = [];

// Create touch controls for mobile
function createControls() {
    const controls = document.createElement('div');
    controls.id = 'controls';
    
    const controlsHTML = `
        <div class="control-btn" id="left">←</div>
        <div class="control-btn" id="up">↑</div>
        <div class="control-btn" id="right">→</div>
    `;
    
    controls.innerHTML = controlsHTML;
    document.body.appendChild(controls);
    
    // Add touch event listeners
    document.getElementById('left').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
    document.getElementById('left').addEventListener('touchend', () => keys['ArrowLeft'] = false);
    
    document.getElementById('up').addEventListener('touchstart', () => {
        keys['ArrowUp'] = true;
        rocket.thrust = true;
    });
    document.getElementById('up').addEventListener('touchend', () => {
        keys['ArrowUp'] = false;
        rocket.thrust = false;
    });
    
    document.getElementById('right').addEventListener('touchstart', () => keys['ArrowRight'] = true);
    document.getElementById('right').addEventListener('touchend', () => keys['ArrowRight'] = false);
}

// Keyboard input handling
window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === 'ArrowUp') rocket.thrust = true;
});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
    if (e.key === 'ArrowUp') rocket.thrust = false;
});

// Create starfield optimized for full screen
function createStars(count) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.3
    }));
}

// Create particles for rocket exhaust
function createParticles() {
    if (rocket.thrust) {
        for (let i = 0; i < 3; i++) {
            particles.push({
                x: rocket.x - Math.sin(rocket.rotation) * (rocket.height/2 + 5),
                y: rocket.y + Math.cos(rocket.rotation) * (rocket.height/2 + 5),
                size: Math.random() * 4 + 2,
                speed: Math.random() * 3 + rocket.speed,
                angle: rocket.rotation + (Math.random() - 0.5) * 0.5,
                life: 20
            });
        }
    }
}

// Draw rocket with dynamic lighting
function drawRocket() {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.rotation);
    
    // Rocket body with gradient
    const gradient = ctx.createLinearGradient(0, -rocket.height/2, 0, rocket.height/2);
    gradient.addColorStop(0, '#ff5e62');
    gradient.addColorStop(1, '#ff0000');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, -rocket.height/2);
    ctx.lineTo(-rocket.width/2, rocket.height/2);
    ctx.lineTo(rocket.width/2, rocket.height/2);
    ctx.closePath();
    ctx.fill();
    
    // Rocket cockpit
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(0, -rocket.height/6, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Draw stars with parallax effect
function drawStars() {
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw particles
function drawParticles() {
    particles.forEach((p, i) => {
        const alpha = p.life / 20;
        ctx.fillStyle = `rgba(255, ${Math.floor(100 + Math.random() * 155)}, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        
        // Update particle
        p.x -= Math.sin(p.angle) * p.speed;
        p.y += Math.cos(p.angle) * p.speed;
        p.life--;
        
        // Remove dead particles
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    });
}

// Update game state
function update() {
    // Rotation
    if (keys['ArrowLeft']) rocket.rotation -= 0.05;
    if (keys['ArrowRight']) rocket.rotation += 0.05;
    
    // Movement (direction-sensitive)
    if (keys['ArrowUp']) {
        rocket.x -= Math.sin(rocket.rotation) * rocket.speed;
        rocket.y += Math.cos(rocket.rotation) * rocket.speed;
        
        // Move stars for parallax effect
        stars.forEach(star => {
            star.x += Math.sin(rocket.rotation) * star.speed;
            star.y -= Math.cos(rocket.rotation) * star.speed;
            
            // Wrap stars around screen
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
        });
    }
    
    // Screen wrapping
    if (rocket.x < -rocket.width) rocket.x = canvas.width + rocket.width;
    if (rocket.x > canvas.width + rocket.width) rocket.x = -rocket.width;
    if (rocket.y < -rocket.height) rocket.y = canvas.height + rocket.height;
    if (rocket.y > canvas.height + rocket.height) rocket.y = -rocket.height;
    
    // Create particles
    createParticles();
}

// Main render function
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
    
    drawStars();
    drawParticles();
    drawRocket();
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize the game
startButton.addEventListener('click', () => {
    rocket.score++;
    scoreElement.textContent = rocket.score;
});

// Create mobile controls if needed
if ('ontouchstart' in window) {
    createControls();
}

gameLoop();
