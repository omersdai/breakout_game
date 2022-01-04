const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 600;
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
  size: 10,
  color: 'red',
  dx: 5,
  dy: -4,
};

const player = {
  x: 400,
  y: 560,
  height: 20,
  width: 150,
  color: 'white',
  dx: 0,
  dy: 0,
  speed: 10,
};

const blockColors = [
  'rgb(228, 101, 122)',
  'rgb(204, 46, 46)',
  'rgb(255, 166, 0)',
  'rgb(214, 214, 57)',
  'rgb(79, 145, 79)',
  'rgb(60, 60, 192)',
  'rgb(161, 68, 173)',
  'rgb(0, 191, 255)',
];
const blockColumnCount = 13;
const blockHeight = 30;
const margin = 10;
const gap = 3;
// canvas.width = margin + blockWidth * blockCount + (blockCount) * gap * 2 + margin
const blockWidth = parseInt(
  (canvas.width - margin * 2 - blockColumnCount * gap * 2) / blockColumnCount
);

const blocks = [];
populateBlocks();

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  drawCircle();
  drawPlayer();
  drawBlocks();

  moveObjects();
  detectCollusion();

  requestAnimationFrame(update);
}
update();

function drawCircle() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

function drawPlayer() {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = player.color;
  ctx.strokeRect(player.x, player.y, player.width, player.height);
}

function drawBlocks() {
  blocks.forEach((block) => drawRectangle(block));
}

function drawRectangle(rectangle) {
  ctx.beginPath();
  ctx.fillStyle = rectangle.color;
  ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
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
  if (
    ball.x + ball.size > canvas.width ||
    ball.x - ball.size < 0 ||
    hitRectangleHorizontally(player)
  ) {
    ball.dx *= -1;
  }

  // Detect top and bottom walls
  if (
    ball.y + ball.size > canvas.height ||
    ball.y - ball.size < 0 ||
    hitRectangleVertically(player) ||
    hitBlockVertically()
  ) {
    ball.dy *= -1;
  }

  // Player detect side walls
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;
}

function hitBlockVertically() {
  for (let i = 0; i < blocks.length; i++) {
    if (hitRectangleVertically(blocks[i])) {
      blocks.splice(i, 1);
      return true;
    }
  }
  return false;
}

function hitBlockHorizontally() {
  for (let i = 0; i < blocks.length; i++) {
    if (hitRectangleHorizontally(blocks[i])) {
      blocks.splice(i, 1);
      return true;
    }
  }
  return false;
}

function hitRectangleVertically(rectangle) {
  const horizontallyAligned =
    rectangle.x <= ball.x + ball.size &&
    ball.x - ball.size <= rectangle.x + rectangle.width;
  const hitsTopSide =
    ball.y - ball.size <= rectangle.y && rectangle.y <= ball.y + ball.size;
  const hitsBotSide =
    ball.y - ball.size <= rectangle.y + rectangle.height &&
    rectangle.y + rectangle.height <= ball.y + ball.size;
  return horizontallyAligned && (hitsTopSide || hitsBotSide);
}

function hitRectangleHorizontally(rectangle) {
  const verticallyAligned =
    rectangle.y <= ball.y + ball.size &&
    ball.y - ball.size <= rectangle.y + rectangle.height;
  const hitsLeftSide =
    ball.x - ball.size <= rectangle.x && rectangle.x <= ball.x + ball.size;
  const hitsRightSide =
    ball.x - ball.size <= rectangle.x + rectangle.width &&
    rectangle.x + rectangle.width <= ball.x + ball.size;
  return verticallyAligned && (hitsLeftSide || hitsRightSide);
}

function populateBlocks() {
  const rowCount = blockColors.length;

  for (let i = 0; i < rowCount; i++) {
    const y = i * (blockHeight + 3);
    const color = blockColors[i];
    for (let j = 0; j < blockColumnCount; j++) {
      const x = margin + j * blockWidth + (j + 1) * gap * 2;
      const block = createRectangle(x, y, color);
      blocks.push(block);
    }
  }
}

function createRectangle(x, y, color) {
  return {
    x,
    y,
    color,
    height: blockHeight,
    width: blockWidth,
  };
}

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
