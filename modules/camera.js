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

export function updateCamera(target) {
    if (camera.target) {
        // Center the camera on the target, accounting for scale
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
