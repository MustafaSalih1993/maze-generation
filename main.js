const canvas = document.querySelector("canvas");
const solveBtn = document.querySelector("#solve");
const resetBtn = document.querySelector("#reset");
const scale = 20;
const ctx = canvas.getContext("2d");
canvas.width = Math.floor(window.innerWidth - scale * 4);
canvas.height = Math.floor(window.innerHeight - scale * 10);
canvas.style.backgroundColor = "#F2F2F2";

let animation = requestAnimationFrame(animate);

let grid = [];
let log = [];
let stack = [];

let cols = Math.floor(canvas.height / scale);
let rows = Math.floor(canvas.width / scale);
initGrid();
// this variable is the red point you see in the maze generator animation
let current = grid[0][Math.floor(cols / 2)];
// initializing start and end positions in the maze
let start = current;
let end = grid[rows - 1][Math.floor(cols / 2)];

stack.push(current);
current.solved = true;

function startSolve() {
  solveBtn.classList.remove("button-primary");
  solveBtn.disabled = true;
  solve();
}

function initGrid() {
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }
}

function drawGrid() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].draw();
    }
  }
}

function drawSolve() {
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("S", start.i * scale + scale / 2, start.j * scale + scale / 2);
  ctx.fillText("E", end.i * scale + scale / 2, end.j * scale + scale / 2);
  for (let i = 0; i < stack.length - 1; i++) {
    const elt = stack[i];
    ctx.beginPath();
    ctx.strokeStyle = "#BBBF39";
    ctx.moveTo(elt.i * scale + scale / 2, elt.j * scale + scale / 2);
    ctx.lineTo(
      stack[i + 1].i * scale + scale / 2,
      stack[i + 1].j * scale + scale / 2
    );
    ctx.stroke();
    ctx.closePath();
  }
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  let y = a.j - b.j;
  if (x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  if (x == 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  }
  if (y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
  if (y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  }
}

function startMaze() {
  current.visited = true;
  current.highLight();
  let next = current.rNeighbor();
  if (next) {
    log.push(current);
    removeWalls(next, current);
    current = next;
  } else {
    if (log.length) {
      current = log.pop();
    }
  }
}

async function solve() {
  if (current == end) return;
  while (current !== end) {
    await sleep(25);
    let nn = current.getNeighbors();
    if (nn) {
      if (nn[0]) {
        stack.push(nn[0]);
        current = nn[0];
        current.solved = true;
      } else if (nn[1]) {
        stack.push(nn[1]);
        current = nn[1];
        current.solved = true;
      } else if (nn[2]) {
        stack.push(nn[2]);
        current = nn[2];
        current.solved = true;
      } else if (nn[3]) {
        stack.push(nn[3]);
        current = nn[3];
        current.solved = true;
      }
    } else {
      if (stack.length) {
        current = stack.pop();
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let fps = 60;
let now;
let then = Date.now();
let delta;
let interval = 50 / fps;

function animate() {
  animation = requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;
  if (delta > interval) {
    then = now - (delta % interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    startMaze();
    if (!log.length) {
      solveBtn.classList.add("button-primary");
      solveBtn.disabled = false;
    }
    if (stack.length) {
      drawSolve();
    }
  }
}

// startPoint&endPoint: 1d array have an x,y ex: [0,10]
async function mazeReset(startPoint, endPoint) {
  grid = [];
  log = [];
  stack = [];
  solveBtn.disabled = true;
  canvas.width = Math.floor(window.innerWidth - scale * 2);
  canvas.height = Math.floor(window.innerHeight / 2);
  cols = Math.floor(canvas.height / scale);
  rows = Math.floor(canvas.width / scale);
  initGrid();
  current = grid[startPoint[0]][startPoint[1]];
  start = current;
  end = grid[endPoint[0]][endPoint[1]];
  stack.push(current);
  current.solved = true;
  drawGrid();
  cancelAnimationFrame(animate);
  animate();
}

resetBtn.addEventListener(
  "click",
  async () =>
    await mazeReset([0, Math.floor(cols / 2)], [rows - 1, Math.floor(cols / 2)])
);
solveBtn.addEventListener("click", async () => await solve());
animate();
