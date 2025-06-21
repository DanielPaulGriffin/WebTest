import { lineColor,polyFillColor,bgColor } from './colors.js';

// Define the lineColor variable at the top of the file
//export const lineColor = '#484848';
//'#484848' - grey
//'#16f110' - green
//

export class Polygon {
    constructor(points, color = lineColor, offset = {x: 2000, y: 2000}) {
        this.points = points;
        this.color = color;
        this.offset = offset;
        this.lineWidth = 2;
    }
    
    draw(ctx) {
        ctx.beginPath();
        // Use world coordinates directly
        ctx.moveTo(this.points[0].x + this.offset.x, this.points[0].y + this.offset.y);
        
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x + this.offset.x, this.points[i].y + this.offset.y);
        }
        
        ctx.closePath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        
        // Fill polygon
        ctx.fillStyle = polyFillColor;
        ctx.fill();
    }
    
    containsPoint(x, y) {
        let inside = false;
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const xi = this.points[i].x + this.offset.x;
            const yi = this.points[i].y + this.offset.y;
            const xj = this.points[j].x + this.offset.x;
            const yj = this.points[j].y + this.offset.y;
            
            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
}

export function createPolygons() {
    // Each level is an array of Polygon objects
    const levels = [];

    // Level 1
    levels.push([
        new Polygon([
            {x: -3558, y: -419}, {x: -1638, y: -683}, {x: -1462, y: -779}, 
            {x: -1326, y: -859}, {x: -1094, y: -835}, {x: -814, y: -627}, 
            {x: -598, y: -603}, {x: -350, y: -683}, {x: -158, y: -675}, 
            {x: 66, y: -555}, {x: 226, y: -419}, {x: 194, y: -267}, 
            {x: 146, y: -107}, {x: -30, y: 5}, {x: -286, y: 45}, 
            {x: -446, y: 133}, {x: -542, y: 325}, {x: -446, y: 509}, 
            {x: -70, y: 677}, {x: 114, y: 717}, {x: 314, y: 685}, 
            {x: 394, y: 485}, {x: 610, y: 485}, {x: 818, y: 597}, 
            {x: 850, y: 805}, {x: 738, y: 1005}, {x: 538, y: 1077}, 
            {x: 578, y: 1253}, {x: 786, y: 1269}, {x: 986, y: 1165}, 
            {x: 962, y: 1029}, {x: 930, y: 933}, {x: 986, y: 781}, 
            {x: 1058, y: 605}, {x: 890, y: 421}, {x: 706, y: 381}, 
            {x: 618, y: 237}, {x: 506, y: 341}, {x: 298, y: 333}, 
            {x: 194, y: 485}, {x: 42, y: 453}, {x: -94, y: 381}, 
            {x: 130, y: 325}, {x: 218, y: 205}, {x: 218, y: 61}, 
            {x: 370, y: -35}, {x: 578, y: -139}, {x: 634, y: -307}, 
            {x: 618, y: -451}, {x: 618, y: -619}, {x: 802, y: -635}, 
            {x: 994, y: -539}, {x: 1242, y: -603}, {x: 1410, y: -603}, 
            {x: 1666, y: -755}, {x: 1826, y: -675}, {x: 2042, y: -531}, 
            {x: 2762, y: -443}, {x: 3586, y: -587}, {x: 4074, y: -587}, 
            {x: 5442, y: -483}, {x: 5490, y: 3589}, {x: -3590, y: 3613}
        ]),
        new Polygon([
            {x: 400, y: 250},
            {x: 688, y: 250},
            {x: 688, y: 300},
            {x: 400, y: 300}
        ], '#e4e4e4', {x: 2150, y: 3000})
    ]);

    // Level 2 (example, add your own polygons)
    levels.push([
        new Polygon([
    {x: -3697, y: 585},
    {x: -2817, y: 481},
    {x: -2449, y: 329},
    {x: -1689, y: 113},
    {x: -545, y: -63},
    {x: -265, y: 225},
    {x: 31, y: 297},
    {x: 479, y: -447},
    {x: 615, y: -343},
    {x: 911, y: -863},
    {x: 1095, y: -871},
    {x: 1295, y: -263},
    {x: 1391, y: -359},
    {x: 1639, y: 249},
    {x: 1871, y: 177},
    {x: 2823, y: 513},
    {x: 3391, y: 305},
    {x: 5167, y: 433},
    {x: 5207, y: 2041},
    {x: -3697, y: 2057}
    ]),
          new Polygon([
            {x: 400, y: 250},
            {x: 600, y: 250},
            {x: 600, y: 300},
            {x: 400, y: 300}
        ], '#e4e4e4', {x: 2500, y: 850})
     ]);

    return levels;
}

export function drawPolygons(polygons, ctx) {
    polygons.forEach(poly => poly.draw(ctx));
}
