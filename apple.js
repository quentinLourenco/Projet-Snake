export default class Apple {
  constructor(gridSize, canvasSize) {
      this.grid = gridSize;
      this.canvasSize = canvasSize;
      this.randomizePosition();
  }

  randomizePosition() {
      this.x = this.getRandomInt(0, this.canvasSize / this.grid) * this.grid;
      this.y = this.getRandomInt(0, this.canvasSize / this.grid) * this.grid;
  }

  getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
  }
}
