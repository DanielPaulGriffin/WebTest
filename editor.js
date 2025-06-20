<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Polygon Editor for Rocket Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            color: #fff;
        }
        
        header {
            text-align: center;
            margin-bottom: 20px;
            width: 100%;
            max-width: 800px;
        }
        
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 0 0 10px rgba(0, 200, 255, 0.7);
            background: linear-gradient(to right, #00c6ff, #0072ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .container {
            display: flex;
            gap: 20px;
            width: 100%;
            max-width: 1200px;
        }
        
        .editor-container {
            flex: 1;
            background: rgba(10, 20, 40, 0.8);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0, 100, 255, 0.3);
        }
        
        .canvas-container {
            position: relative;
            border: 2px solid #00aaff;
            border-radius: 8px;
            overflow: hidden;
            background: #0a1020;
            margin-bottom: 15px;
        }
        
        #editorCanvas {
            display: block;
            background: #0a1020;
            cursor: crosshair;
        }
        
        .controls {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(0, 30, 60, 0.5);
            border-radius: 8px;
        }
        
        .control-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        label {
            font-weight: bold;
            color: #00ccff;
        }
        
        input, button, select {
            padding: 10px;
            border: 1px solid #0077ff;
            border-radius: 5px;
            background: rgba(0, 40, 80, 0.7);
            color: white;
            font-size: 1rem;
        }
        
        button {
            background: linear-gradient(to right, #0072ff, #00c6ff);
            color: white;
            font-weight: bold;
            cursor: pointer;
            border: none;
            transition: all 0.3s;
            box-shadow: 0 0 10px rgba(0, 150, 255, 0.5);
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 150, 255, 0.7);
        }
        
        button:active {
            transform: translateY(1px);
        }
        
        #clearBtn {
            background: linear-gradient(to right, #ff416c, #ff4b2b);
        }
        
        .output-container {
            flex: 1;
            background: rgba(10, 20, 40, 0.8);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0, 100, 255, 0.3);
        }
        
        .output-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        h2 {
            color: #00ccff;
            font-size: 1.8rem;
        }
        
        textarea {
            width: 100%;
            height: 300px;
            background: rgba(0, 20, 40, 0.7);
            border: 1px solid #0077ff;
            border-radius: 8px;
            padding: 15px;
            color: #00ffcc;
            font-family: monospace;
            font-size: 1rem;
            resize: none;
            box-shadow: inset 0 0 10px rgba(0, 100, 255, 0.3);
        }
        
        .instructions {
            background: rgba(0, 30, 60, 0.5);
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 0.9rem;
            line-height: 1.6;
        }
        
        .instructions h3 {
            color: #00ccff;
            margin-bottom: 10px;
        }
        
        .instructions ul {
            padding-left: 20px;
        }
        
        .instructions li {
            margin-bottom: 8px;
        }
        
        .point-indicator {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #ff0000;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
        }
        
        .status-bar {
            margin-top: 10px;
            padding: 8px;
            background: rgba(0, 50, 100, 0.6);
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            color: #00ffcc;
        }
        
        @media (max-width: 900px) {
            .container {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Rocket Game Polygon Editor</h1>
        <p>Create custom polygons for your rocket game collision system</p>
    </header>
    
    <div class="container">
        <div class="editor-container">
            <h2>Polygon Editor</h2>
            <div class="canvas-container">
                <canvas id="editorCanvas" width="600" height="400"></canvas>
            </div>
            
            <div class="controls">
                <div class="control-group">
                    <label for="colorPicker">Polygon Color:</label>
                    <input type="color" id="colorPicker" value="#16f110">
                </div>
                
                <div class="control-group">
                    <label for="lineWidth">Line Width:</label>
                    <input type="range" id="lineWidth" min="1" max="10" value="2">
                </div>
                
                <div class="control-group">
                    <label>Actions:</label>
                    <button id="clearBtn">Clear Polygon</button>
                </div>
            </div>
            
            <div class="status-bar" id="statusBar">
                Click to place the first point of your polygon
            </div>
            
            <div class="instructions">
                <h3>How to Use:</h3>
                <ul>
                    <li><strong>Click</strong> on the canvas to place polygon points</li>
                    <li><strong>Right-click</strong> to remove the last placed point</li>
                    <li><strong>Hold CTRL</strong> and click the first point to close the polygon</li>
                    <li>Adjust color and line width using the controls above</li>
                    <li>Copy the generated code from the output panel to your game.js file</li>
                </ul>
            </div>
        </div>
        
        <div class="output-container">
            <div class="output-header">
                <h2>Polygon Code</h2>
                <button id="copyBtn">Copy Code</button>
            </div>
            <textarea id="polygonOutput" readonly>// Your polygon code will appear here</textarea>
            
            <div class="instructions">
                <h3>How to Use in Game:</h3>
                <ul>
                    <li>Copy the generated code above</li>
                    <li>In your game.js file, add the polygon to your polygons array</li>
                    <li>Example: <code>polygons.push(new Polygon([...points...], '#16f110'));</code></li>
                    <li>Adjust the color if needed to match your game's style</li>
                </ul>
            </div>
        </div>
    </div>

    <script>
        // Canvas setup
        const canvas = document.getElementById('editorCanvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('colorPicker');
        const lineWidth = document.getElementById('lineWidth');
        const clearBtn = document.getElementById('clearBtn');
        const copyBtn = document.getElementById('copyBtn');
        const polygonOutput = document.getElementById('polygonOutput');
        const statusBar = document.getElementById('statusBar');
        
        // Polygon data
        let points = [];
        let isDrawing = false;
        let currentColor = colorPicker.value;
        let currentLineWidth = lineWidth.value;
        
        // Set canvas size to container
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            redrawCanvas();
        }
        
        // Draw everything on canvas
        function redrawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid
            drawGrid();
            
            // Draw existing points and lines
            if (points.length > 0) {
                drawPolygon();
            }
        }
        
        // Draw a grid for reference
        function drawGrid() {
            const gridSize = 20;
            ctx.strokeStyle = 'rgba(0, 100, 200, 0.2)';
            ctx.lineWidth = 1;
            
            // Vertical lines
            for (let x = 0; x <= canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            
            // Horizontal lines
            for (let y = 0; y <= canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        }
        
        // Draw the polygon
        function drawPolygon() {
            // Draw lines between points
            ctx.beginPath();
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentLineWidth;
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            
            // Close polygon if we have at least 3 points
            if (points.length >= 3) {
                ctx.closePath();
            }
            
            ctx.stroke();
            
            // Draw points
            points.forEach(point => {
                ctx.beginPath();
                ctx.fillStyle = '#ff0000';
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fill();
                
                // Highlight the first point
                if (point === points[0]) {
                    ctx.beginPath();
                    ctx.fillStyle = '#00ff00';
                    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }
        
        // Generate polygon code
        function generatePolygonCode() {
            if (points.length < 3) {
                return "// Add at least 3 points to create a polygon";
            }
            
            let code = "[\n";
            
            points.forEach(point => {
                code += `    {x: ${Math.round(point.x)}, y: ${Math.round(point.y)}},\n`;
            });
            
            code = code.slice(0, -2); // Remove last comma and newline
            code += "\n]";
            
            return code;
        }
        
        // Update the status bar
        function updateStatus() {
            if (points.length === 0) {
                statusBar.textContent = "Click to place the first point of your polygon";
            } else if (points.length === 1) {
                statusBar.textContent = "Click to place the second point. Right-click to remove last point";
            } else if (points.length === 2) {
                statusBar.textContent = "Click to place the next point. Hold CTRL and click the first point to close polygon";
            } else {
                statusBar.textContent = `${points.length} points placed. Hold CTRL and click the first point to close polygon. Right-click to remove last point`;
            }
        }
        
        // Handle mouse clicks
        function handleMouseClick(e) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if we're closing the polygon (CTRL + click first point)
            if (e.ctrlKey && points.length >= 2) {
                const firstPoint = points[0];
                const distance = Math.sqrt(Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2));
                
                if (distance < 15) {
                    // Close the polygon
                    polygonOutput.value = generatePolygonCode();
                    statusBar.textContent = "Polygon completed! Code generated. Copy and paste into your game.js file.";
                    return;
                }
            }
            
            // Add a new point
            points.push({x, y});
            redrawCanvas();
            polygonOutput.value = generatePolygonCode();
            updateStatus();
        }
        
        // Handle right-click (remove last point)
        function handleContextMenu(e) {
            e.preventDefault(); // Prevent the context menu
            if (points.length > 0) {
                points.pop();
                redrawCanvas();
                polygonOutput.value = generatePolygonCode();
                updateStatus();
            }
        }
        
        // Event listeners
        canvas.addEventListener('click', handleMouseClick);
        canvas.addEventListener('contextmenu', handleContextMenu);
        
        colorPicker.addEventListener('input', () => {
            currentColor = colorPicker.value;
            redrawCanvas();
        });
        
        lineWidth.addEventListener('input', () => {
            currentLineWidth = lineWidth.value;
            redrawCanvas();
        });
        
        clearBtn.addEventListener('click', () => {
            points = [];
            redrawCanvas();
            polygonOutput.value = "// Your polygon code will appear here";
            updateStatus();
        });
        
        copyBtn.addEventListener('click', () => {
            polygonOutput.select();
            document.execCommand('copy');
            
            // Show confirmation
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
        
        // Initialize
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        updateStatus();
    </script>
</body>
</html>
