class Cell {
  constructor(i, j) {
    this.i = i
    this.j = j
    this.visited = false
    this.solved = false
    this.walls = [true, true, true, true]
  }
  rNeighbor() {
    let nn = []
    let top, right, bottom, left
    if (grid[this.i][this.j - 1]) {
      top = grid[this.i][this.j - 1]
    }
    if (grid[this.i + 1]) {
      right = grid[this.i + 1][this.j]
    }
    if (grid[this.i][this.j + 1]) {
      bottom = grid[this.i][this.j + 1]
    }
    if (grid[this.i - 1]) {
      left = grid[this.i - 1][this.j]
    }
    if (top && !top.visited) {
      nn.push(top)
    }
    if (right && !right.visited) {
      nn.push(right)
    }
    if (bottom && !bottom.visited) {
      nn.push(bottom)
    }
    if (left && !left.visited) {
      nn.push(left)
    }
    if (nn.length) {
      return nn[Math.floor(Math.random() * nn.length)]
    }
  }
  getNeighbors() {
    let nn = []
    let top, right, bottom, left
    if (grid[this.i][this.j - 1]) {
      top = grid[this.i][this.j - 1]
    }
    if (grid[this.i + 1]) {
      right = grid[this.i + 1][this.j]
    }
    if (grid[this.i][this.j + 1]) {
      bottom = grid[this.i][this.j + 1]
    }
    if (grid[this.i - 1]) {
      left = grid[this.i - 1][this.j]
    }
    if (top && !top.solved && !top.walls[2] && !this.walls[0]) {
      nn.push(top)
    }
    if (right && !right.solved && !right.walls[3] && !this.walls[1]) {
      nn.push(right)
    }
    if (bottom && !bottom.solved && !bottom.walls[0] && !this.walls[2]) {
      nn.push(bottom)
    }
    if (left && !left.solved && !left.walls[1] && !this.walls[3]) {
      nn.push(left)
    }
    if (nn.length) {
      return nn
    }
  }
  highLight(color) {
    ctx.beginPath()
    ctx.fillStyle = color || '#A60F1B'
    ctx.rect(this.i * scale, this.j * scale, scale, scale)
    ctx.fill()
    ctx.closePath()
  }
  draw() {
    let x = this.i * scale
    let y = this.j * scale
    ctx.beginPath()
    ctx.strokeStyle = '#D9D9D9'
    ctx.lineWidth = 5
    if (this.walls[0]) {
      ctx.moveTo(x, y)
      ctx.lineTo(x + scale, y)
    }
    if (this.walls[1]) {
      ctx.moveTo(x + scale, y)
      ctx.lineTo(x + scale, y + scale)
    }
    if (this.walls[2]) {
      ctx.moveTo(x + scale, y + scale)
      ctx.lineTo(x, y + scale)
    }
    if (this.walls[3]) {
      ctx.moveTo(x, y + scale)
      ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.closePath()
    if (this.visited) {
      ctx.beginPath()
      ctx.fillStyle = '#262626'
      ctx.rect(this.i * scale, this.j * scale, scale, scale)
      ctx.fill()
      ctx.closePath()
    }
  }
}