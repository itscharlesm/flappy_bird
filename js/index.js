const startBtn = document.getElementById("startBtn");
const startCard = document.getElementById("startCard");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const bgMusic = document.getElementById("bgMusic"); // 🎵 Background music

let birdY = canvas.height / 2;
let birdX = 50;
let gravity = 0.25;
let velocity = 0;
let jump = -8;
let pipes = [];
let gameOver = false;
let score = 0;
let pipeSpeed = 1.4;
let milestoneShown = false;

// 🎯 Milestone messages
const milestones = [
    { points: 5, message: "Good morning my pretty baby iaaah!☀️💖 It's the first day of November so start your day with your lovely smile. Just know that I'm really blessed to have you in my life by. This might not be much but, I hope these message will sink in your mind. Goodluck!" },
    { points: 10, message: "Charrr!🔥👏 Naka 10 points na siya. Hapit na ma touch naka, chrlng go byyy ayaw give up! hapit na 20 points. Kaya naaa!" },
    { points: 20, message: "Woooow!🏆 Na reach niya ang 20. Congrats byyy! Unta wala ka na stress kay ang purpose ani is para malingaw ug ma challenge ka. May pa ganto? Syempre, it's not just a game but also a reminder not to give up. There are times na magkamali ka, ayaw nato huna hunaa ang importante unsaon nimo pag bawi sa remainder questions. Near na kaayo ang board exam, and I know deep inside pressured naka and kulbaan naka. Ang mga anxieties mu sink in na saimo. But I know you're prepared so believe in yourself by. You're smart, you're a hardworking person, and I do admire your resilience in the face of challenges. If there are times na you feel down, you need someone to vent to, talk to, or unsa ba. Remind lng taka na you have me. Fighting byyyy! Get that license! God bless youuuu! I love you by!" }
];

// Start button
startBtn.addEventListener("click", startGame);

function startGame() {
    startCard.style.display = "none";
    canvas.style.display = "block";
    resetRound(true); // full reset
    bgMusic.currentTime = 0;
    bgMusic.play(); // 🎵 start looping music
    requestAnimationFrame(update);
}

// Controls
document.addEventListener("keydown", e => {
    if (e.code === "Space" && !gameOver) flap();
});

canvas.addEventListener("click", () => {
    if (!gameOver) flap();
    else {
        // 🧠 Game Over — show restart card
        bgMusic.play();
        startCard.style.display = "block";
        canvas.style.display = "none";
        startCard.innerHTML = `
            <h1>Flappy Bird 🐤</h1>
            <p>Awhhh Game Over... You scored <strong>${score}</strong> points. Sige lang try lang usab.</p>
            <button id="restartBtn">Try Again</button>
        `;
        document.getElementById("restartBtn").addEventListener("click", () => {
            score = 0; // reset score on restart
            startGame();
        });
    }
});

function flap() {
    velocity = jump;
}

// ✅ resetRound: reset gameplay (keep or reset score)
function resetRound(fullReset) {
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    gameOver = false;
    milestoneShown = false;

    if (fullReset) score = 0; // reset score only on full restart
    pipes.push(createPipe());
}

function createPipe() {
    const gap = 220;
    const topHeight = Math.random() * (canvas.height - gap - 100) + 50;
    return {
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + gap,
        passed: false
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

        // Collision first
        const hitPipe =
            birdX + 15 > pipe.x &&
            birdX - 15 < pipe.x + 50 &&
            (birdY - 10 < pipe.topHeight || birdY + 10 > pipe.bottomY);

        if (hitPipe) {
            gameOver = true;
            bgMusic.play();
            break;
        }

        // ✅ Scoring (only if not game over)
        if (!pipe.passed && pipe.x + 50 < birdX && !gameOver) {
            score++;
            pipe.passed = true;

            // 🎯 Check for milestone
            checkMilestone(score);
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
    ctx.fillText("Points: " + score, 10, 30);

    // Ground/ceiling collision
    if (birdY + 10 > canvas.height || birdY - 10 < 0) {
        gameOver = true;
        bgMusic.play();
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

// 🎯 Check for milestone messages
function checkMilestone(currentScore) {
    const milestone = milestones.find(m => m.points === currentScore);
    if (milestone && !milestoneShown) {
        milestoneShown = true;
        showMilestoneMessage(milestone.message);
    }
}

// 🪧 Show milestone overlay
function showMilestoneMessage(text) {
    bgMusic.play();
    canvas.style.display = "none";
    startCard.innerHTML = `
        <h1>Flappy Bird 🐤</h1>
        <p>${text}</p>
        <button id="continueBtn">Continue</button>
    `;
    startCard.style.display = "block";

    document.getElementById("continueBtn").addEventListener("click", () => {
        startCard.style.display = "none";
        canvas.style.display = "block";
        resetRound(false); // 🟡 don't reset score
        bgMusic.play(); // 🎵 resume background music
        requestAnimationFrame(update);
    });
}