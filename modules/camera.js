export const camera = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    target: null
};

export function initCamera(width, height, target) {
    camera.width = width;
    camera.height = height;
    camera.target = target;
    camera.x = target.x - width/2;
    camera.y = target.y - height/2;
}

export function updateCamera(target) {
    if (camera.target) {
        // Smooth camera follow
        camera.x += (target.x - camera.width/2 - camera.x) * 0.05;
        camera.y += (target.y - camera.height/2 - camera.y) * 0.05;
    }
}

export function transform(x, y) {
    return {
        x: x - camera.x,
        y: y - camera.y
    };
}
