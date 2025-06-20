import { rocket } from './rocket.js';
import { createCollisionParticles } from './particles.js';

export function checkCollisions(rocket, polygons, particles, scoreElement) {
    // Calculate rocket vertices
    const vertices = [
        // Nose (top vertex)
        {
            x: rocket.x + Math.sin(rocket.rotation) * (rocket.height/2),
            y: rocket.y - Math.cos(rocket.rotation) * (rocket.height/2)
        },
        // Left wing
        {
            x: rocket.x - Math.cos(rocket.rotation) * (rocket.width/2) - Math.sin(rocket.rotation) * (rocket.height/2),
            y: rocket.y - Math.sin(rocket.rotation) * (rocket.width/2) + Math.cos(rocket.rotation) * (rocket.height/2)
        },
        // Right wing
        {
            x: rocket.x + Math.cos(rocket.rotation) * (rocket.width/2) - Math.sin(rocket.rotation) * (rocket.height/2),
            y: rocket.y + Math.sin(rocket.rotation) * (rocket.width/2) + Math.cos(rocket.rotation) * (rocket.height/2)
        }
    ];
    
    // Check each polygon against all collision points
    for (const poly of polygons) {
        for (const vertex of vertices) {
            if (poly.containsPoint(vertex.x, vertex.y)) {
                handleCollision(vertex.x, vertex.y, particles, scoreElement);
                return; // Only handle one collision per frame
            }
        }
    }
}

function handleCollision(x, y, particles, scoreElement) {
    // Visual feedback
    rocket.colorFlash = 10;
    
    // Physics response (bounce)
    rocket.mx *= -0.7;
    rocket.my *= -0.7;
    
    // Score penalty
    rocket.score = Math.max(0, rocket.score - 5);
    scoreElement.textContent = Math.floor(rocket.score);
    
    // Add collision particles
    createCollisionParticles(x, y, 15);
}
