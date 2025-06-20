// Initialize canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');

// Set canvas dimensions to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Camera settings
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    target: null,
    
    // Initialize camera to follow rocket
    init: function(target) {
        this.target = target;
        this.x = target.x - this.width/2;
        this.y = target.y - this.height/2;
    },
    
    // Update camera position to follow target
    update: function() {
        if (this.target) {
            // Smooth camera follow
            this.x += (this.target.x - this.width/2 - this.x) * 0.05;
            this.y += (this.target.y - this.height/2 - this.y) * 0.05;
        }
    },
    
    // Convert world coordinates to screen coordinates
    transform: function(x, y) {
        return {
            x: x - this.x,
            y: y - this.y
        };
    }
};

// Rocket object
const rocket = {
    x: 2000,  // Start in world space
    y: 2000,
    mx: 0,
    my: 0,
    width: 30,
    height: 50,
    speed: 0.04,
    rotation: 0,
    thrust: false,
    score: 0,
    colorFlash: 0
};

// Initialize camera to follow rocket
camera.init(rocket);

// POLYGON CLASS
class Polygon {
    constructor(points, color = '#16f110') {
        this.points = points;
        this.color = color;
        this.lineWidth = 2;
    }
    
    draw() {
        ctx.beginPath();
        const start = camera.transform(this.points[0].x, this.points[0].y);
        ctx.moveTo(start.x, start.y);
        
        for (let i = 1; i < this.points.length; i++) {
            const point = camera.transform(this.points[i].x, this.points[i].y);
            ctx.lineTo(point.x, point.y);
        }
        
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        
        // Fill polygon with semi-transparent color
        ctx.fillStyle = this.color + '33'; // 20% opacity
        ctx.fill();
    }
    
    // Point-in-polygon collision detection
    containsPoint(x, y) {
        let inside = false;
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const xi = this.points[i].x, yi = this.points[i].y;
            const xj = this.points[j].x, yj = this.points[j].y;
            
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
}

// Create polygons in world space
const polygons = [];
const worldSize = 4000;  // Size of the game world

// Generate random polygons
for (let i = 0; i < 15; i++) {
    const points = [];
    const sides = Math.floor(Math.random() * 4) + 3; // 3-6 sides
    const centerX = Math.random() * worldSize;
    const centerY = Math.random() * worldSize;
    const radius = 50 + Math.random() * 100;
    
    for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius * (0.7 + Math.random() * 0.6);
        const y = centerY + Math.sin(angle) * radius * (0.7 + Math.random() * 0.6);
        points.push({x, y});
    }
    
    polygons.push(new Polygon(points));
}

// Create stars in world space
const stars = [];
for (let i = 0; i < 300; i++) {
    stars.push({
        x: Math.random() * worldSize,
        y: Math.random() * worldSize,
        size: Math.random() * 3,
        opacity: Math.random() * 0.5 + 0.3
    });
}

const keys = {};
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

// Create collision particles
function createCollisionParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 5 + 2,
            speed: Math.random() * 4 + 2,
            angle: Math.random() * Math.PI * 2,
            life: 30
        });
    }
}

// Draw rocket with dynamic lighting
function drawRocket() {
    ctx.save();
    const screenPos = camera.transform(rocket.x, rocket.y);
    ctx.translate(screenPos.x, screenPos.y);
    ctx.rotate(rocket.rotation);
    
    // Flash red on collision
    if (rocket.colorFlash > 0) {
        ctx.fillStyle = '#ff0000';
        rocket.colorFlash--;
    } else {
        // Normal rocket gradient
        const gradient = ctx.createLinearGradient(0, -rocket.height/2, 0, rocket.height/2);
        gradient.addColorStop(0, '#ff5e62');
        gradient.addColorStop(1, '#ff0000');
        ctx.fillStyle = gradient;
    }
    
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

// Draw stars
function drawStars() {
    stars.forEach(star => {
        const screenPos = camera.transform(star.x, star.y);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw particles
function drawParticles() {
    particles.forEach((p, i) => {
        const screenPos = camera.transform(p.x, p.y);
        const alpha = p.life / 30;
        ctx.fillStyle = `rgba(255, ${Math.floor(100 + Math.random() * 155)}, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, p.size * alpha, 0, Math.PI * 2);
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

// COLLISION DETECTION AND RESPONSE
function checkCollisions() {
    // Create collision points at rocket nose and body
    const collisionPoints = [
        // Nose point (front of rocket)
        {
            x: rocket.x + Math.sin(rocket.rotation) * (rocket.height/2),
            y: rocket.y - Math.cos(rocket.rotation) * (rocket.height/2)
        },
        // Center point
        {x: rocket.x, y: rocket.y},
        // Left wing
        {
            x: rocket.x + Math.sin(rocket.rotation - Math.PI/3) * (rocket.width/2),
            y: rocket.y - Math.cos(rocket.rotation - Math.PI/3) * (rocket.width/2)
        },
        // Right wing
        {
            x: rocket.x + Math.sin(rocket.rotation + Math.PI/3) * (rocket.width/2),
            y: rocket.y - Math.cos(rocket.rotation + Math.PI/3) * (rocket.width/2)
        }
    ];
    
    // Check each polygon against all collision points
    for (const poly of polygons) {
        for (const point of collisionPoints) {
            if (poly.containsPoint(point.x, point.y)) {
                handleCollision(point.x, point.y);
                return; // Only handle one collision per frame
            }
        }
    }
}

function handleCollision(x, y) {
    // Visual feedback
    rocket.colorFlash = 10;
    
    // Physics response (bounce)
    rocket.mx *= -0.7;
    rocket.my *= -0.7;
    
    // Score penalty
    rocket.score = Math.max(0, rocket.score - 5);
    scoreElement.textContent = rocket.score;
    
    // Add collision particles
    createCollisionParticles(x, y, 15);
}

// Update game state
function update() {
    // Rotation
    if (keys['ArrowLeft']) rocket.rotation -= 0.05;
    if (keys['ArrowRight']) rocket.rotation += 0.05;
    
    // Movement (direction-sensitive)
    if (keys['ArrowUp']) {
        rocket.mx += Math.sin(rocket.rotation) * rocket.speed;
        rocket.my -= Math.cos(rocket.rotation) * rocket.speed;
    }
    
    // GRAVITY
    rocket.my += 0.005;
    
    // Move Rocket
    rocket.x += rocket.mx;
    rocket.y += rocket.my;
    
    // Update camera to follow rocket
    camera.update();
    
    // World wrapping
    if (rocket.x < -rocket.width) rocket.x = worldSize + rocket.width;
    if (rocket.x > worldSize + rocket.width) rocket.x = -rocket.width;
    if (rocket.y < -rocket.height) rocket.y = worldSize + rocket.height;
    if (rocket.y > worldSize + rocket.height) rocket.y = -rocket.height;
    
    // Create particles
    createParticles();
    
    // Check for collisions
    checkCollisions();
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
    
    // Draw stars
    drawStars();
    
    // Draw polygons
    polygons.forEach(poly => poly.draw());
    
    // Draw particles
    drawParticles();
    
    // Draw rocket
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
