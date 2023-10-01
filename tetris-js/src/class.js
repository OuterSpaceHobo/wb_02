import {msgContainer, msg} from './main'

export class Tetris {
    constructor(boardWidth, boardHeight) {
        this.init(boardWidth, boardHeight);
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    init(boardWidth, boardHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        this.score = 0;
        this.difficulty = 1;
        this.shapes = [
            [[[1, 1, 1, 1]], [[1], [1], [1], [1]]], // I
            [[[1, 1], [1, 1]]], // O
            [[[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]]], // Z
            [[[0, 1, 1], [1, 1]], [[1, 0], [1, 1], [0, 1]]], // S
            [[[1, 1, 1], [0, 1, 0]], [[0, 1], [1, 1], [0, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0], [1, 1], [1, 0]]], // T
            [[[1, 0], [1, 0], [1, 1]], [[1, 1, 1], [1, 0, 0]], [[1, 1], [0, 1], [0, 1]], [[0, 0, 1], [1, 1, 1]]], // L
            [[[1, 1], [1], [1]], [[1, 0, 0], [1, 1, 1]], [[0, 1], [0, 1], [1, 1]], [[1, 1, 1], [0, 0, 1]]] // J
        ];
        this.currentShapeState = [0, 0];  // [индекс фигуры, индекс ориентации]
        this.createNewShape();
        this.paused = false;
    }

    restart() {
        clearInterval(this.timer);
        this.init(this.boardWidth, this.boardHeight);
        this.start();
    }

    rotate(shape) {
        const newShape = [];
        for (let x = 0; x < shape[0].length; x++) {
            newShape[x] = [];
            for (let y = 0; y < shape.length; y++) {
                newShape[x][shape.length - y - 1] = shape[y][x];
            }
        }
        return newShape;
    }
  
    move(direction) {
        let oldPosition = this.currentPosition.x;
        if (direction === 'left') {
            this.currentPosition.x -= 1;
        } else if (direction === 'right') {
            this.currentPosition.x += 1;
        }
        if (!this.isValidMove()) {
            this.currentPosition.x = oldPosition;
        }
        this.draw();
    }
  
    drop() {        
        this.currentPosition.y += 1;
        if (!this.isValidMove()) {
            this.currentPosition.y -= 1;
            this.updateBoard();
            this.createNewShape();
        }
        this.draw();
    }

    togglePause() {
        this.paused = !this.paused
        // Показываем сообщение
        msgContainer.classList.toggle('visible')
        msg.innerText = 'Pause'
    }

    createNewShape() {
        this.currentShapeState[0] = Math.floor(Math.random() * this.shapes.length);
        this.currentShapeState[1] = 0;
        this.currentShape = this.shapes[this.currentShapeState[0]][this.currentShapeState[1]];
        this.currentPosition = {x: Math.floor(this.boardWidth / 2), y: 0};
        if (!this.isValidMove()) {
            // Если новая фигура не может быть помещена на доску, игра заканчивается
            clearInterval(this.timer);
            // Показываем сообщение
            msgContainer.classList.add('visible')
            msg.innerText = 'Game Over'
        }
    }

    isValidMove() {
        for (let y = 0; y < this.currentShape.length; y++) {
            for (let x = 0; x < this.currentShape[y].length; x++) {
                if (this.currentShape[y][x] !== 0) {
                    let boardX = this.currentPosition.x + x;
                    let boardY = this.currentPosition.y + y;
                    if (boardX < 0 || boardX >= this.boardWidth || boardY < 0 || boardY >= this.boardHeight || this.board[boardY][boardX] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
  
    checkGameOver() {
        for (let i = 0; i < this.boardWidth; i++) {
            if (this.board[0][i] !== 0) {
                return true;
            }
        }
        return false;
    }

    updateBoard() {
        // Добавление текущей фигуры на доску
        for (let y = 0; y < this.currentShape.length; y++) {
            for (let x = 0; x < this.currentShape[y].length; x++) {
                if (this.currentShape[y][x] !== 0) {
                    let boardX = this.currentPosition.x + x;
                    let boardY = this.currentPosition.y + y;
                    this.board[boardY][boardX] = 1;
                }
            }
        }
        this.clearLines();
    }

    clearLines() {
        for (let y = 0; y < this.boardHeight; y++) {
            if (this.board[y].every(value => value === 1)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                this.score += 1;
                // За каждые 10 очков, повышаем слодность
                if (this.score % 10 === 0) {
                    this.difficulty += 1;
                    clearInterval(this.timer);
                    this.timer = setInterval(() => {
                        if (!this.paused) {
                            this.drop();
                            this.draw();
                        }
                    }, 1000 / this.difficulty);
                    // console.log('difficulty', this.difficulty)
                }
            }
        }
    }

    updateScore() {
        for (let i = 0; i < this.boardHeight; i++) {
            if (this.board[i].every(val => val !== 0)) {
                this.score += 1;
                this.board.splice(i, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
            }
        }
    }
  
    draw() {
        const gameDiv = document.getElementById('game');
        const scoreDiv = document.getElementById('score');
        const difficulDiv = document.getElementById('difficulty');

        // Очистка предыдущего состояния игры
        gameDiv.innerHTML = '';
        scoreDiv.innerHTML = 'Score: ' + this.score;
        difficulDiv.innerHTML = 'Difficulty: ' + this.difficulty;

        // Рендеринг игрового поля
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x] !== 0 || this.isPartOfCurrentShape(x, y)) {
                    let blockDiv = document.createElement('div');
                    blockDiv.style.top = `${y * 20}px`;
                    blockDiv.style.left = `${x * 20}px`;
                    blockDiv.className = 'block';
                    gameDiv.appendChild(blockDiv);
                }
            }
        }
    }

    isPartOfCurrentShape(x, y) {
        for (let shapeY = 0; shapeY < this.currentShape.length; shapeY++) {
            for (let shapeX = 0; shapeX < this.currentShape[shapeY].length; shapeX++) {
                if (this.currentShape[shapeY][shapeX] !== 0 && this.currentPosition.x + shapeX === x && this.currentPosition.y + shapeY === y) {
                    return true;
                }
            }
        }
        return false;
    }

    rotateCurrentShape() {
        let oldShapeState = [...this.currentShapeState];
        this.currentShapeState[1] = (this.currentShapeState[1] + 1) % this.shapes[this.currentShapeState[0]].length;
        this.currentShape = this.shapes[this.currentShapeState[0]][this.currentShapeState[1]];
        if (!this.isValidMove()) {
            // Если вращение недопустимо, вернуть фигуру в исходное положение
            this.currentShapeState = oldShapeState;
            this.currentShape = this.shapes[this.currentShapeState[0]][this.currentShapeState[1]];
        }
    }

    start() {
        // Чистим сообщение
        msgContainer.classList.remove('visible')
        msg.innerText = ''
        // Ставим интервал
        clearInterval(this.timer);
        this.draw();
        this.timer = setInterval(() => {
            if (!this.paused) {
                this.drop();
                this.draw();
            }
        }, 1000); 
    }

    restart() {        
        // Чистим сообщение
        msgContainer.classList.remove('visible')
        msg.innerText = ''
        // Чистим интервал
        clearInterval(this.timer);
        this.init(this.boardWidth, this.boardHeight);
        this.start();
    }

    handleKeyDown(event) {
        if (this.paused && event.keyCode !== 32 && event.keyCode !== 82) return;
        switch (event.keyCode) {
            case 37:  // ArrowLeft
                this.move('left');
                break;
            case 39:  // ArrowRight
                this.move('right');
                break;
            case 40:  // ArrowDown
                !this.isValidMove() ? '' : this.drop();
                break;
            case 38:  // ArrowUp
                this.rotateCurrentShape();
                break;
            case 32:  // Space
                !this.isValidMove() ? '' : this.togglePause();
                break;
            case 82:  // 'r' или 'R'
                this.restart();
                break;
        }
        if (!this.paused) this.draw();
    }

}