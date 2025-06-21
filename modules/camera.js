export const camera = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    target: null,
    scale: 1 // Add scale property
};

export function initCamera(width, height, target, scale = 1) {
    camera.width = width;
    camera.height = height;
    camera.target = target;
    camera.x = target.x - width/2;
    camera.y = target.y - height/2;
    camera.scale = scale; // Initialize scale
}
export function updateCameraToBounds(levels,currentLevel) {
    const levelPolys = levels[(currentLevel+1)%levels.length];
    const pad = levelPolys[levelPolys.length - 1]; // landing pad
    // gather all world‑space points of pad
    const padPoints = pad.points.map(p => ({
        x: p.x + (pad.offset?.x || 0),
        y: p.y + (pad.offset?.y || 0)
    }));
    // include rocket position
    padPoints.push({ x: rocket.x, y: rocket.y });

    // compute bounding box
    const xs = padPoints.map(p => p.x);
    const ys = padPoints.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const worldW = maxX - minX, worldH = maxY - minY;

    // compute scale to fit both in view, with 10% padding
    const scaleX = canvas.width  / (worldW * 1.1);
    const scaleY = canvas.height / (worldH * 1.1);
    const newScale = Math.min(scaleX, scaleY);
    setCameraScale(newScale);

    // center camera on the midpoint
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    camera.x = centerX - camera.width  / (2 * camera.scale);
    camera.y = centerY - camera.height / (2 * camera.scale);
}
export function updateCamera(target) {
    if (camera.target) {
        camera.x = target.x - camera.width / (2 * camera.scale);
        camera.y = target.y - camera.height / (2 * camera.scale);
    }
}
export function setCameraScale(scale) {
    camera.scale = scale;
}
export function transform(x, y) {
    // Apply translation and scaling
    return {
        x: (x - camera.x) * camera.scale,
        y: (y - camera.y) * camera.scale
    };
}
