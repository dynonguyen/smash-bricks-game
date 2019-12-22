let canvas = document.getElementById('canvas-id');
let game = canvas.getContext('2d');

//variable
let dxBall = DEFAULT_SPEEP_X, dyBall = DEFAULT_SPEEP_Y;
let dxSkate = 15;
let ball_x = START_POS_BALL_X, ball_y = START_POS_BALL_Y;
let skate_x = START_POS_SKATE_X;

//co hieu flag giup viec di chuyen muot hon
let isMovingLeft = false;
let isMovingRight = false;

//flag ket thuc game
let isGameOver = false;
let isWon = false;
let combo = 0;
let nBrokenBrick = 0;
//diem nguoi choi
let score = 0;
let htmlScore = document.getElementById('score');
var renderScore = () => {
    let content = '<h2> ' + 'Score: ' + score + '</h2>';
    htmlScore.innerHTML = content;
}

//level
let level = 1;
let htmlLevel = document.getElementById('level');
var renderLevel = () => {
    let content = '<h2> ' + 'Level: ' + level + '</h2>';
    htmlLevel.innerHTML = content;
}
// =============== BALL ================ //
var drawBall = (x, y) => {
    game.beginPath();
    game.arc(x, y, BALL_RADIUS, 0, Math.PI * 2, true);
    game.fillStyle = BALL_COLOR;
    game.fill();
    game.closePath();
}

var updateBallPosition = () => {
    ball_x += dxBall;
    ball_y += dyBall;
    if (ball_x < BALL_RADIUS || ball_x > WIDTH - BALL_RADIUS) {
        dxBall = -dxBall;
    }
    if (ball_y < BALL_RADIUS || ball_y > HEIGHT - BALL_RADIUS) {
        dyBall = - dyBall;
    }
}

// ============= SKATEBOARD ============ //
var drawSkateBoard = (x, y) => {
    game.beginPath();
    game.rect(x, y, SKATE_WIDTH, SKATE_HEIGHT);
    game.fillStyle = SKATE_COLOR;
    game.fill();
    game.closePath();
}

//move skateboard
document.addEventListener('keydown', (event) => {
    if (event.key === 'a' || event.key === 'A' || event.keyCode === 37)
        isMovingLeft = true;
    else if (event.key === 'd' || event.key === 'D' || event.keyCode === 39)
        isMovingRight = true;
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'a' || event.key === 'A' || event.keyCode === 37)
        isMovingLeft = false;
    else if (event.key === 'd' || event.key === 'D' || event.keyCode === 39)
        isMovingRight = false;
});

var moveSkateBoard = () => {
    if (isMovingLeft === true) {
        if (skate_x > 0)
            skate_x -= dxSkate;
    }
    else if (isMovingRight === true) {
        if (skate_x < WIDTH - SKATE_WIDTH)
            skate_x += dxSkate;
    }
}

//ball collide skateboard
var ballCollideSkate = () => {
    let yBall = ball_y + BALL_RADIUS;
    let pos_1 = (SKATE_Y + SKATE_HEIGHT);
    let pos_2 = (skate_x + SKATE_WIDTH);
    if (yBall >= SKATE_Y && yBall <= pos_1 && ball_x >= skate_x && ball_x <= pos_2) {
        dyBall = -dyBall;
        combo = 0;
    }
}

// ============= BRICKS ================ //
let bricksList = [];
let bricksColor = [BRICKS_COLOR, 'purple', 'blue', 'pink'];

var initBricksMap = () => {
    let nPower;
    if (level < 6)
        nPower = level;
    else
        nPower = level + 3;
    let count = 0;
    let colorPos = 0;
    for (let i = 0; i < level; ++i) {
        for (let j = 0; j < N_COLUMN; ++j) {
            if (count <= nPower && colorPos === 0) {
                colorPos = Math.round(Math.random() * 3);
                ++count;
            } else
                colorPos = 0;

            bricksList.push({
                x: (OFFSET_X + j * (BRICKS_MARGIN + BRICKS_WIDTH)),
                y: i * 2 * BRICKS_HEIGHT + OFFSET_Y,
                color: bricksColor[colorPos],
                isBroken: false
            });
        }
    }
}

var drawBricksMap = () => {
    for (let i = 0; i < bricksList.length; ++i) {
        let n = ballCollideBricks(bricksList[i]);
        if (n > bricksList.length)
            n = bricksList.length;
        if (bricksList[i].isBroken === false) {
            game.beginPath();
            game.rect(bricksList[i].x, bricksList[i].y, BRICKS_WIDTH, BRICKS_HEIGHT);
            game.fillStyle = bricksList[i].color;
            game.fill();
            game.closePath();
        } else {
            bricksList.splice(i, n);
        }
    }
}

var ballCollideBricks = (bricks) => {
    let res = 1;
    let pos_1 = (bricks.x + BRICKS_WIDTH);
    let pos_2 = (bricks.y + BRICKS_HEIGHT);
    if (ball_x >= bricks.x && ball_x <= pos_1 && ball_y >= bricks.y && ball_y <= pos_2) {
        if (bricks.color === bricksColor[1])
            res = 2;
        else if (bricks.color === bricksColor[2])
            res = 3;
        else if (bricks.color === bricksColor[3])
            res = 4;
        bricks.isBroken = true;
        nBrokenBrick++;
        dyBall = -dyBall;
        combo++;
        score += combo * res * 100;
        return res;
    }
    return 0;
}
// ============ GAME OVER ============= //
var checkGameOver = () => {
    if (ball_y >= HEIGHT - BALL_RADIUS)
        isGameOver = true;
    if (bricksList.length === 0) {

        ++level;

        if (dxBall > 0)
            dxBall++;
        else
            dxBall--;
        if (dyBall > 0)
            dyBall++
        else
            dyBall--;

        if (level > MAX_LEVEL) {
            isGameOver = true;
            isWon = true;
        } else {
            renderLevel();
            initBricksMap();
        }
    }
}

//handle gameover
var handleGameOver = (requestID) => {
    if (isWon === true) {
        alert('Chơi cũng tàm tạm đó :">. Ngon thì chơi lại !!');
    } else {
        alert('Chơi gà quá đê :">');
    }
    cancelAnimationFrame(requestID);
}

// =========== MAIN GAME ============ //
var mainGame = () => {
    if (!isGameOver) {
        renderScore();
        game.clearRect(0, 0, WIDTH, HEIGHT);
        drawBall(ball_x, ball_y);
        updateBallPosition();
        checkGameOver();
        drawBricksMap();
        drawSkateBoard(skate_x, SKATE_Y);
        moveSkateBoard();
        ballCollideSkate();
        //  ballCollideBricks();
        // ham ho tro viec render tren canvas, giup chuyen dong muon hon
        var requestID = requestAnimationFrame(mainGame);
    } else {
        handleGameOver(requestID);
    }
}

//init
initBricksMap();
drawBall(ball_x, ball_y);
drawBricksMap();
drawSkateBoard(skate_x, SKATE_Y);
renderLevel();

//loop
mainGame();