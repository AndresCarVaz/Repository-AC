const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("raceBtn");

let particles = [];
let active = false;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(4, 10);
        this.speedX = random(-2, 2);
        this.speedY = random(-5, -1);
        this.color = `hsl(${random(10, 60)}, 100%, 50%)`; // Colores cálidos (fuego)
        this.life = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size *= 0.95;
        this.life -= 0.02;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0 || particles[i].size < 0.5) {
            particles.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (active) {
        let x = canvas.width / 2;
        let y = canvas.height;
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(x, y));
        }
    }
    handleParticles();
    requestAnimationFrame(animate);
}

// Redimensiona canvas
function resizeCanvas() {
    canvas.width = 300;
    canvas.height = 150;
}
resizeCanvas();

animate();

btn.addEventListener("click", () => {
    active = true;
    setTimeout(() => {
        active = false;
    }, 1500); // partículas durante 1.5 segundos
});
