(function snakeGame() {
    let score = 0;
    let snakeX;
    let snakeY;
    let snakeDirection;
    let snakeLength;
    let interval;

    //arena element
    const arena = document.getElementById('arena');
    const arenaGrid = [];
    const arenaWidth = 80;
    const arenaHeight = 55;

    //create point
    function setPoint() {
        let pointX = Math.floor(Math.random()*arenaWidth);
        let pointY = Math.floor(Math.random()*arenaHeight);
        arenaGrid[pointY][pointX].point = 1;
    };

    //create red point
    let timer = document.getElementById('timer');
    function setRedPoint() {
        let pointX = Math.floor(Math.random()*arenaWidth);
        let pointY = Math.floor(Math.random()*arenaHeight);
        arenaGrid[pointY][pointX].redPoint = 1;

        let count = 4;
        let timerInterval = setInterval (() => {
            if(count >= 0) {
                timer.style.display = 'flex';
                timer.innerHTML = count+1;
                count--;
            } else {
                arenaGrid[pointY][pointX].redPoint = 0;
            }
            if (arenaGrid[pointY][pointX].redPoint === 0) {
                timer.style.display = 'none';
            }
        }, 1000)
        return timerInterval;
        };

    //create cells
    function createGame() {
        for (let y = 0; y < arenaHeight; y++) {
            let row = [];
            for (let x = 0; x < arenaWidth; x++) {
                let cell = {
                    snake: 0
                };
                cell.element = document.createElement('div');
                row.push(cell);
                arena.appendChild(cell.element);
            }
            arenaGrid.push(row);
        }
        setStartPosition();
    };

    //start game
    function setStartPosition() {
        snakeX = Math.floor(arenaWidth/2);
        snakeY = arenaHeight - 6;
        snakeLength = 4;
        snakeDirection = 'Up';

        for (let y = 0; y < arenaHeight; y++) {
            for (var x = 0; x < arenaWidth; x++) {
                arenaGrid[y][x].snake = 0;
                arenaGrid[y][x].point = 0;
            }
        }
        for (let i = 0; i <= snakeLength; i++) {
            arenaGrid[snakeY+i][snakeX].element.className = 'snake';
            arenaGrid[snakeY+i][snakeX].snake = 1;
        }
        setPoint();
    }
    //reset game
    function reset() {
        for (let y = 0; y < arenaHeight; y++) {
            for (let x = 0; x < arenaWidth; x++) {
                arenaGrid[y][x].snake = 0;
                arenaGrid[y][x].point = 0;
                arenaGrid[y][x].redPoint = 0;
            }
        }
        score *= 0;
        document.getElementById('score').innerHTML = score;
        setStartPosition();
    }

    //snake moving
    document.addEventListener (
        'keydown',
        function (e) {
            e.stopPropagation();
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp': if(snakeDirection !== 'Down') {snakeDirection = 'Up'}; break;
                case 'ArrowDown': if(snakeDirection !== 'Up') {snakeDirection = 'Down'}; break;
                case 'ArrowLeft': if(snakeDirection !== 'Right') {snakeDirection = 'Left'}; break;
                case 'ArrowRight': if(snakeDirection !== 'Left') {snakeDirection = 'Right'}; break;
                default: return;
            }
        },
        false
    )

    function snakeMoving() {
        interval = setInterval (() => {
            arenaGrid[snakeY][snakeX].snake = snakeLength;
            switch (snakeDirection) {
            case 'Up':    snakeY--; break;
            case 'Down':  snakeY++; break;
            case 'Left':  snakeX--; break;
            case 'Right': snakeX++; break;
        }
        if(snakeX < 0 || snakeX >= arenaWidth || snakeY < 0 || snakeY >= arenaHeight || arenaGrid[snakeY][snakeX].snake > 0) {
            
            clearInterval(interval);
            for (let y = 0; y < arenaHeight; y++) {
                for (let x = 0; x < arenaWidth; x++) {
                    arenaGrid[y][x].redPoint = 0;
                }
            }

            //create and show gameover window
        let gameOverWindow = document.createElement('div');
        gameOverWindow.setAttribute('id', 'gameOverWindow');
        gameOverWindow.classList.add('gameOverWindow');
        let goText = document.createElement('h3');
        goText.classList.add('goText');
        goText.innerHTML = `GAME OVER ! <br/> Your score is:  ${score} <br/> If you want to play again, press the button below`;
        gameOverWindow.appendChild(goText);

        let goButton = document.createElement('button');
        goButton.setAttribute('type', 'button');
        goButton.classList.add('goButton');
        goButton.innerHTML = `Play again`;
        gameOverWindow.appendChild(goButton);
        arena.appendChild(gameOverWindow);
        gameOverWindow.style.display = 'flex';
    
        goButton.onclick = () => {
        arena.removeChild(gameOverWindow);
        reset();
        snakeMoving();
    }   
        }

        //set red point
        if(arenaGrid[snakeY][snakeX].point === 1) {
            snakeLength++;
            score++;
            document.getElementById('score').innerHTML = score;
            arenaGrid[snakeY][snakeX].point = 0;
            setPoint();
            if (snakeLength % 5 === 0) {
                setRedPoint();
            }
        }
        if(arenaGrid[snakeY][snakeX].redPoint === 1) {
            snakeLength++;
            score += 5;
            document.getElementById('score').innerHTML = score;
            arenaGrid[snakeY][snakeX].redPoint = 0;
            
        }

        for (let y = 0; y < arenaHeight; y++) {
            for (let x = 0; x < arenaWidth; x++) {
                let cell = arenaGrid[y][x];
                if (cell.snake > 0) {
                    cell.element.className = 'snake';
                    cell.snake -= 1;
                } else if (cell.point === 1) {
                    cell.element.className = 'point';
                } else if (cell.redPoint === 1) {
                    cell.element.className = 'redPoint';
                } else {
                    cell.element.className = '';
                }
            }
        }
        }, 100)
        return interval;
    }
createGame();
setStartPosition();
snakeMoving();
}());