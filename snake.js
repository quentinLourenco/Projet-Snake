export default class Snake {
  constructor(gridSize) {
      this.grid = gridSize;
      this.reset();
  }

  reset() {
      this.x = 160;
      this.y = 160;
      this.dx = this.grid;
      this.dy = 0;
      this.cells = [];
      this.maxCells = 4;
  }

  update() {
      this.x += this.dx;
      this.y += this.dy;

      this.cells.unshift({ x: this.x, y: this.y });
      if (this.cells.length > this.maxCells) {
          this.cells.pop();
      }
  }

  changeDirection(dx, dy) {
      if ((dx !== 0 && this.dx === 0) || (dy !== 0 && this.dy === 0)) {
          this.dx = dx;
          this.dy = dy;
      }
  }
}
