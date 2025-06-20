import { transform } from './camera.js';

export const particles = [];

export function createParticles() {
    // This is just a placeholder - particles are created elsewhere
}

export function updateParticles(particles) {
    particles.forEach((p, i) => {
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

export function drawParticles(particles,ctx) {
    particles.forEach(p => {
        const screenPos = transform(p.x, p.y);
        const alpha = p.life / 30;
        ctx.fillStyle = `rgba(255, ${Math.floor(100 + Math.random() * 155)}, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
    });
}

export function createCollisionParticles(x, y, count) {
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
