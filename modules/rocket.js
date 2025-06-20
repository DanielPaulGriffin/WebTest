import { transform } from './camera.js';

export const rocket = {
    x: 2000,
    y: 900,
    mx: 0,
    my: 0,
    width: 30,
    height: 50,
    speed: 0.1,
    rotation: 0,
    thrust: false,
    score: 0,
    colorFlash: 0
};

export function initRocket() {
    rocket.x = 2000;
    rocket.y = 900;
    rocket.mx = 0;
    rocket.my = 0;
    rocket.rotation = 0;
    rocket.thrust = false;
    rocket.score = 0;
    rocket.colorFlash = 0;
}

export function updateRocket(keys, deltaTime) {
    // Rotation
    const rotationSpeed = 0.075 * (deltaTime / 16);
    if (keys['ArrowLeft'] || keys['a']) rocket.rotation -= rotationSpeed;
    if (keys['ArrowRight'] || keys['d']) rocket.rotation += rotationSpeed;
    
    // Movement (direction-sensitive)
    if (keys['ArrowUp'] || keys['w']) {
        const thrustForce = rocket.speed * (deltaTime / 16);
        rocket.mx += Math.sin(rocket.rotation) * thrustForce;
        rocket.my -= Math.cos(rocket.rotation) * thrustForce;
        rocket.thrust = true;
    } else {
        rocket.thrust = false;
    }
    
    // Gravity
    rocket.my += 0.01 * (deltaTime / 16);
    
    // Move Rocket
    rocket.x += rocket.mx;
    rocket.y += rocket.my;
    
    // World wrapping (4000x4000 world)
    const worldSize = 4000;
    if (rocket.x < -rocket.width) rocket.x = worldSize + rocket.width;
    if (rocket.x > worldSize + rocket.width) rocket.x = -rocket.width;
    if (rocket.y < -rocket.height) rocket.y = worldSize + rocket.height;
    if (rocket.y > worldSize + rocket.height) rocket.y = -rocket.height;
}

export function drawRocket(ctx) {
    const screenPos = transform(rocket.x, rocket.y);
    
    // Save and transform canvas
    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);
    ctx.rotate(rocket.rotation);
    
    // Flash red on collision
    if (rocket.colorFlash > 0) {
        ctx.fillStyle = '#ff0000';
        rocket.colorFlash--;
    } else {
        ctx.fillStyle = '#16f110';
    }
    
    // Draw rocket body
    ctx.beginPath();
    ctx.moveTo(0, -rocket.height/2);
    ctx.lineTo(-rocket.width/2, rocket.height/2);
    ctx.lineTo(rocket.width/2, rocket.height/2);
    ctx.closePath();
    
    // Style and fill
    ctx.strokeStyle = '#16f110';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = `rgba(10, 10, 10, 1)`;
    ctx.fill();
    
    // Draw cockpit window
    ctx.fillStyle = '#16f110';
    ctx.beginPath();
    ctx.arc(0, -rocket.height/4, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

export function createExhaustParticles(rocket, particles) {
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
