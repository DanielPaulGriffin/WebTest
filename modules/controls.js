export const keys = {};

export function initControls() {
    // Keyboard input handling
    window.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.key === 'ArrowUp' || e.key === 'w') {
            keys['ArrowUp'] = true;
        }
    });

    window.addEventListener('keyup', e => {
        keys[e.key] = false;
        if (e.key === 'ArrowUp' || e.key === 'w') {
            keys['ArrowUp'] = false;
        }
    });
    
    // Create touch controls for mobile
    if ('ontouchstart' in window) {
        createTouchControls();
    }
}

function createTouchControls() {
    const controls = document.createElement('div');
    controls.id = 'controls';
    
    controls.innerHTML = `
        <div class="control-btn" id="left">←</div>
        <div class="control-btn" id="up">↑</div>
        <div class="control-btn" id="right">→</div>
    `;
    
    document.body.appendChild(controls);
    
    // Add touch event listeners
    document.getElementById('left').addEventListener('touchstart', () => keys['ArrowLeft'] = true);
    document.getElementById('left').addEventListener('touchend', () => keys['ArrowLeft'] = false);
    
    document.getElementById('up').addEventListener('touchstart', () => {
        keys['ArrowUp'] = true;
    });
    document.getElementById('up').addEventListener('touchend', () => {
        keys['ArrowUp'] = false;
    });
    
    document.getElementById('right').addEventListener('touchstart', () => keys['ArrowRight'] = true);
    document.getElementById('right').addEventListener('touchend', () => keys['ArrowRight'] = false);
}
