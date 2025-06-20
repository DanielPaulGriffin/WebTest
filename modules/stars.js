import { transform } from './camera.js';

export function createStars(count, worldSize) {
    const stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * worldSize,
            y: Math.random() * worldSize,
            size: Math.random() * 3,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
    return stars;
}

export function drawStars(stars) {
    stars.forEach(star => {
        const screenPos = transform(star.x, star.y);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}
