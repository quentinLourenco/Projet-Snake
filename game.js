import Snake from './snake.js';
import Apple from './apple.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.grid = 16;
        this.snake = new Snake(this.grid);
        this.apple = new Apple(this.grid, canvas.width);
        this.count = 0;
        this.interval = 100;
        this.lastTime = 0;
        this.score = 0;

        this.highscores = this.generateHighscores();

        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.getElementById('replay').addEventListener('click', () => this.resetGame());
        document.getElementById('highscore-form').addEventListener('submit', (e) => this.submitHighscore(e));
    }

    handleKeydown(event) {
        switch (event.which) {
            case 37:
                if (this.snake.dx === 0) this.snake.changeDirection(-this.grid, 0);
                break;
            case 38:
                if (this.snake.dy === 0) this.snake.changeDirection(0, -this.grid);
                break;
            case 39:
                if (this.snake.dx === 0) this.snake.changeDirection(this.grid, 0);
                break;
            case 40:
                if (this.snake.dy === 0) this.snake.changeDirection(0, this.grid);
                break;
        }
    }

    start() {
        document.getElementById('game').style.display = 'block';
        document.getElementById('score').style.display = 'block';
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('replay').style.display = 'none';
        document.getElementById('new-highscore').style.display = 'none';
        document.getElementById('highscores').style.display = 'none';
        requestAnimationFrame((time) => this.loop(time));
    }

    loop(currentTime) {
        this.animationFrameId = requestAnimationFrame((time) => this.loop(time));

        if (currentTime - this.lastTime >= this.interval) {
            this.lastTime = currentTime;
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.snake.update();

            if (this.snake.x < 0) {
                this.snake.x = this.canvas.width - this.grid;
            } else if (this.snake.x >= this.canvas.width) {
                this.snake.x = 0;
            }

            if (this.snake.y < 0) {
                this.snake.y = this.canvas.height - this.grid;
            } else if (this.snake.y >= this.canvas.height) {
                this.snake.y = 0;
            }

            this.context.fillStyle = 'red';
            this.context.fillRect(this.apple.x, this.apple.y, this.grid - 1, this.grid - 1);

            this.context.fillStyle = 'green';
            this.snake.cells.forEach((cell, index) => {
                this.context.fillRect(cell.x, cell.y, this.grid - 1, this.grid - 1);

                if (cell.x === this.apple.x && cell.y === this.apple.y) {
                    this.snake.maxCells++;
                    this.apple.randomizePosition();
                    this.updateScore(10); // Ajoutez des points au score
                }

                for (let i = index + 1; i < this.snake.cells.length; i++) {
                    if (cell.x === this.snake.cells[i].x && cell.y === this.snake.cells[i].y) {
                        this.endGame();
                        return;
                    }
                }
            });
        }
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('score').innerText = 'Score: ' + this.score;
    }

    resetScore() {
        this.score = 0;
        document.getElementById('score').innerText = 'Score: ' + this.score;
    }

    endGame() {
        cancelAnimationFrame(this.animationFrameId);
        document.getElementById('game').style.display = 'none';
        document.getElementById('score').style.display = 'none';
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('final-score').innerText = 'Votre score est de : ' + this.score;
        document.getElementById('replay').style.display = 'block';

        if (this.score > this.highscores[this.highscores.length - 1].score) {
            document.getElementById('new-highscore').style.display = 'block';
        } else {
            document.getElementById('highscores').style.display = 'block';
        }

        this.updateHighscoreTable();
    }

    resetGame() {
        this.snake.reset();
        this.apple.randomizePosition();
        this.resetScore();
        this.start();
    }

    generateHighscores() {
        const pseudos = [
            "Joueur du Grenier", "Vlad", "Califano", "Asterix", "Obelix",
            "Lucky Luke", "Tintin", "Milou", "Haddock", "Dupont",
            "Dupond", "Gaston Lagaffe", "Spirou", "Fantasio", "Marsupilami",
            "Schtroumpf", "Gargamel", "Garfield", "Odie", "Jon Arbuckle"
        ];
        const scores = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) * 10);
        const highscores = pseudos.map((pseudo, index) => ({
            pseudo: pseudo,
            score: scores[index]
        }));

        highscores.sort((a, b) => b.score - a.score);

        return highscores;
    }

    updateHighscoreTable() {
        const tbody = document.getElementById('highscore-table');
        tbody.innerHTML = '';
        this.highscores.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${entry.pseudo}</td><td>${entry.score}</td>`;
            tbody.appendChild(row);
        });
    }

    submitHighscore(event) {
        event.preventDefault();
        const pseudo = document.getElementById('pseudo').value;
        const error = document.getElementById('form-error');

        if (pseudo.length >= 6 && pseudo.length <= 20) {
            error.style.display = 'none';
            this.highscores.pop();
            this.highscores.push({ pseudo: pseudo, score: this.score });
            this.highscores.sort((a, b) => b.score - a.score);
            document.getElementById('new-highscore').style.display = 'none';
            document.getElementById('highscores').style.display = 'block';
            this.updateHighscoreTable();
        } else {
            error.style.display = 'block';
        }
    }
}
