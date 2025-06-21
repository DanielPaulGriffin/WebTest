import { createCollisionParticles } from './particles.js';

export function checkCollisions(rocket, polygons, particles, scoreElement, resetCallback,wonCallback) {
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
            if (poly.containsPoint(vertex.x + poly.offset.x, vertex.y + poly.offset.y)) {
            //if (poly.containsPoint(vertex.x, vertex.y)) {
            	if(poly.color == '#e4e4e4')
                {
                    if (wonCallback && typeof wonCallback === 'function') 
                    {
                        wonCallback();
                    }
                    return;
                } 
                handleCollision(vertex.x, vertex.y, particles, scoreElement, resetCallback);
                return; // Only handle one collision per frame
            }
        }
    }
}

function handleCollision(x, y, particles, scoreElement, resetCallback) {
    // Create collision particles
    createCollisionParticles(x, y, 15);
    
    // Call the reset callback from main.js
    if (resetCallback && typeof resetCallback === 'function') {
       // resetCallback();
    }
}
