const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.height = 600;
canvas.width = 1000;

const [UP, RIGHT, DOWN, LEFT] = [
  'ArrowUp',
  'ArrowRight',
  'ArrowDown',
  'ArrowLeft',
];

const ball = {
  x: 500,
  y: 500,
  size: 20,
  dx: 5,
  dy: 4,
};

const player = {
  x: 500,
  y: 550,
  height: 25,
  width: 200,
  dx: 0,
  dy: 0,
  speed: 5,
};

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case RIGHT:
      player.dx = player.speed;
      break;
    case LEFT:
      player.dx = -player.speed;
      break;
  }
});

document.addEventListener('keyup', (e) => {
  player.dx = 0;
});

function drawCircle() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
}

function drawPlayer() {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'white';
  ctx.strokeRect(player.x, player.y, player.width, player.height);
  ctx.fill();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  drawCircle();
  drawPlayer();

  moveObjects();
  detectCollusion();

  requestAnimationFrame(update);
}

function moveObjects() {
  // ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // player
  player.x += player.dx;
}

function detectCollusion() {
  // Ball
  // Detect side walls
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }

  // Detect top and bottom walls
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Player detect side walls
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

update();
