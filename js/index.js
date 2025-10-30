const startBtn = document.getElementById("startBtn");
const startCard = document.getElementById("startCard");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const flapSound = document.getElementById("flapSound");

let birdY = canvas.height / 2;
let birdX = 50;
let gravity = 0.25;
let velocity = 0;
let jump = -8;
let pipes = [];
let gameOver = false;
let score = 0;
let pipeSpeed = 1.4;

// Start button
startBtn.addEventListener("click", () => {
    startCard.style.display = "none";
    canvas.style.display = "block";
    resetGame();
    requestAnimationFrame(update);
});

// Controls
document.addEventListener("keydown", e => {
    if (e.code === "Space" && !gameOver) flap();
});

canvas.addEventListener("click", () => {
    if (!gameOver) flap();
    else {
        resetGame();
        requestAnimationFrame(update);
    }
});

function flap() {
    velocity = jump;
    flapSound.currentTime = 0;
    flapSound.play();
}

function resetGame() {
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    pipes.push(createPipe());
}

function createPipe() {
    const gap = 170;
    const topHeight = Math.random() * (canvas.height - gap - 100) + 50;
    return {
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + gap,
        passed: false // 👈 new flag for scoring
    };
}

function update() {
    if (gameOver) return;

    // Background
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bird physics
    velocity += gravity;
    birdY += velocity;

    // Pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.x -= pipeSpeed;

        ctx.fillStyle = "#228B22";
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, 50, canvas.height - pipe.bottomY);

        // Collision
        if (
            birdX + 15 > pipe.x &&
            birdX - 15 < pipe.x + 50 &&
            (birdY - 10 < pipe.topHeight || birdY + 10 > pipe.bottomY)
        ) {
            gameOver = true;
        }

        // ✅ Scoring fix — increase score once per pipe
        if (!pipe.passed && pipe.x + 50 < birdX) {
            score++;
            pipe.passed = true;
        }

        // Remove off-screen pipes
        if (pipe.x + 50 < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }

    // Add new pipe
    if (pipes[pipes.length - 1].x < canvas.width - 220) {
        pipes.push(createPipe());
    }

    // Draw bird
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(birdX, birdY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Ground/ceiling collision
    if (birdY + 10 > canvas.height || birdY - 10 < 0) {
        gameOver = true;
    }

    // Game over overlay
    if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", 110, 230);
        ctx.font = "20px Arial";
        ctx.fillText("Click to Restart", 130, 270);
        return;
    }

    requestAnimationFrame(update);
}