import { transform,setCameraScale } from './camera.js';
import { lineColor } from './colors.js'; // Add this import

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

    // Calculate rocket speed (magnitude)
    const velocity = Math.sqrt(rocket.mx * rocket.mx + rocket.my * rocket.my);
    // Set scale: zoom out as speed increases, clamp between 0.5 and 1.2
    let zoomInLimit = 1.5;
    let zoomOutLimit = 0.4;
    let rateOfChange = .2;
    const scale = Math.max(zoomOutLimit, Math.min(zoomInLimit, zoomInLimit - velocity * rateOfChange));
    setCameraScale(scale);
    
    // World wrapping (4000x4000 world)
    const worldSize = 4000;
    if (rocket.x < -rocket.width) rocket.x = worldSize + rocket.width;
    if (rocket.x > worldSize + rocket.width) rocket.x = -rocket.width;
    if (rocket.y < -rocket.height) rocket.y = worldSize + rocket.height;
    if (rocket.y > worldSize + rocket.height) rocket.y = -rocket.height;
}

export function drawRocket(ctx) {
    ctx.save();
    ctx.translate(rocket.x, rocket.y); // world coordinates
    ctx.rotate(rocket.rotation);

    // Flash red on collision
    if (rocket.colorFlash > 0) {
        ctx.fillStyle = '#ff0000';
        rocket.colorFlash--;
    } else {
        ctx.fillStyle = lineColor;
    }

    // Draw rocket body
    ctx.beginPath();
    ctx.moveTo(0, -rocket.height/2);
    ctx.lineTo(-rocket.width/2, rocket.height/2);
    ctx.lineTo(rocket.width/2, rocket.height/2);
    ctx.closePath();

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = `rgba(10, 10, 10, 1)`;
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
