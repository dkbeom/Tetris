// import BLOCKS from "./blocks.js";

// DOM
const table = document.querySelector(".playground > table");
const scoreDisplay = document.querySelector(".score");
const finalScore = document.querySelector(".gameover .gameover-modal .finalScoreValue");
const ending = document.querySelector(".gameover");
const restart = document.querySelector(".restart");
const startingScreen = document.querySelector(".gamestart");
const start = document.querySelector(".start");

const ROWS = 20;
const COLS = 10;

let score = 0;
let fallInterval;
let duration = 500;

const movingBlock = {
    type: "",
    direction: 0,
    X: 0,
    Y: 0,
};

function init() {
    for (let i = 0; i < ROWS; i++) {
        prependNewLine();
    }
    createNewBlock();
}

// 테이블 맨 위에 한 줄 추가
function prependNewLine() {
    const row = document.createElement("tr");
    for (let j = 0; j < COLS; j++) {
        const element = document.createElement("td");
        row.prepend(element);
    }
    table.prepend(row);
}

// 새로운 블럭 생성
function createNewBlock() {

    clearInterval(fallInterval);
    fallInterval = setInterval(()=>{
        moveBlock('Y', 1);
    },duration);

    const blockTypeList = Object.keys(BLOCKS);
    const random = Math.floor(Math.random() * blockTypeList.length);

    // 생성되는 새 블럭
    movingBlock.type = blockTypeList[random];
    movingBlock.direction = 0;
    movingBlock.X = 3;
    movingBlock.Y = 0;

    // 새로 생성되는 블럭이 바로 테스트 불통하면 게임 종료
    if(testBlock(movingBlock)){
        gameover();
    }
    
    renderMovingBlock();
    renderVirtualBlock();
}

// 무빙 블럭 렌더링
function renderMovingBlock(move="", moveType="") {

    // 기존 무빙 제거
    eraseBlock("moving");

    if(move === false && moveType === 'Y'){
        seizeBlock();
        checkMatch();
        createNewBlock();
    } else {
        // 새 무빙 추가
        printBlock(movingBlock, "moving");
    }
}

// 가상 블럭 렌더링
function renderVirtualBlock() {

    const virtualBlock = Object.assign({}, movingBlock);

    // 장애물(블럭, 바닥)을 만날 때까지 밑으로 내린다
    while(true){
        virtualBlock.Y++;
        // 테스트 불통하면
        if(testBlock(virtualBlock)){
            virtualBlock.Y--;
            break;
        }
    }

    // 기존 가상 블럭 지우기
    eraseBlock("virtual");

    // 가상 블럭 프린팅
    printBlock(virtualBlock, "virtual");
}

// 블럭 프린팅
function printBlock({type, direction, X, Y}, virtualOrMoving) {
    BLOCKS[type][direction].forEach(element=>{
        const x = element[0] + X;
        const y = element[1] + Y;
        // 가상 블럭 프린팅
        if(virtualOrMoving === "virtual"){
            table.children[y].children[x].classList.add("virtual");
        }
        // 무빙 블럭 프린팅
        else if(virtualOrMoving === "moving") {
            table.children[y].children[x].classList.add(type, "moving");
        }
        else {

        }
    })
}

// 블럭 프린팅 지우기
function eraseBlock(virtualOrMoving) {
    // 가상 블럭 지우기
    if(virtualOrMoving === "virtual") {
        const virtual = document.querySelectorAll(".virtual");
        virtual.forEach(virtualElement=>{
            virtualElement.classList.remove("virtual");
        })
    }
    // 무빙 블럭 지우기
    else if(virtualOrMoving === "moving") {
        const moving = document.querySelectorAll(".moving");
        moving.forEach(movingElement=>{
            movingElement.classList.remove(movingBlock.type, "moving");
        })
    }
    else {

    }
}

// 블럭이 불가능한지 테스트(불가능하면 true 반환)
function testBlock({type, direction, X, Y}) {
    return BLOCKS[type][direction].some(element=>{
        const x = element[0] + X;
        const y = element[1] + Y;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS || table.children[y].children[x].classList.contains('seized')) {
            // 테스트 불통
            return true;
        }
    })
}

// 블럭을 움직이는 함수
function moveBlock(moveType, amount) {
    let move = true;
    movingBlock[moveType] += amount;
    
    // 테스트 불통하면
    if(testBlock(movingBlock)){
        movingBlock[moveType] -= amount;
        move = false;
    }
    renderMovingBlock(move, moveType);
}

// 블럭을 돌리는 함수
function changeDirection() {
    movingBlock["direction"] === 3 ? movingBlock["direction"] = 0 : movingBlock["direction"] += 1;
    
    // 테스트 불통하면
    if(testBlock(movingBlock)){
        movingBlock["direction"] === 0 ? movingBlock["direction"] = 3 : movingBlock["direction"] -= 1;
    }
    renderMovingBlock();
}

// 블럭을 바로 떨어뜨리는 함수
function dropBlock() {
    clearInterval(fallInterval);
    fallInterval = setInterval(()=>{
        moveBlock('Y', 1);
    },1);
}

// 블럭을 놓여진 상태로 변환
function seizeBlock() {
    const {type, direction, X, Y} = movingBlock;
    BLOCKS[type][direction].forEach(element => {
        const x = element[0] + X;
        const y = element[1] + Y;
        table.children[y].children[x].classList.add(type, "seized");
    })
}

// 줄이 맞춰져있는지 확인
function checkMatch() {
    table.childNodes.forEach(row => {
        let match = true;
        row.childNodes.forEach(element => {
            if(!element.classList.contains("seized")) {
                match = false;
            }
        })
        // 해당 라인이 매치라면
        if(match) {
            row.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }
    })
}

// 게임 오버
function gameover() {
    console.log("게임오버");
    clearInterval(fallInterval);
    finalScore.innerText = score;
    ending.style.display = "flex";
}

document.addEventListener('keydown', e => {
    switch (e.keyCode) {
        // 오른쪽 화살표
        case 39:
            moveBlock('X', 1);
            renderVirtualBlock();
            break;
        // 왼쪽 화살표
        case 37:
            moveBlock('X', -1);
            renderVirtualBlock();
            break;
        // 아래쪽 화살표
        case 40:
            moveBlock('Y', 1);
            renderVirtualBlock();
            break;
        // 위쪽 화살표
        case 38:
            changeDirection();
            renderVirtualBlock();
            break;
        // 스페이스바
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
})

start.addEventListener('click', () => {
    startingScreen.style.display = "none";
    init();
})

restart.addEventListener('click', () => {
    table.innerHTML = "";
    ending.style.display = "none";
    scoreDisplay.innerText = 0;
    finalScore.innerText = 0;
    score = 0;
    init();
})

const BLOCKS = {
    tree: [
        [[1, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [0, 1], [1, 1], [1, 2]],
        [[2, 1], [0, 1], [1, 1], [1, 2]],
        [[2, 1], [1, 2], [1, 1], [1, 0]]
    ],
    square: [
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]],
        [[0, 0], [0, 1], [1, 0], [1, 1]]
    ],
    bar: [
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[1, 0], [1, 1], [1, 2], [1, 3]],
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[2, 0], [2, 1], [2, 2], [2, 3]]
    ],
    zee: [
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[2, 0], [1, 1], [2, 1], [1, 2]],
        [[0, 0], [1, 0], [1, 1], [2, 1]],
        [[2, 0], [1, 1], [2, 1], [1, 2]]
    ],
    invertedZee: [
        [[1, 0], [2, 0], [0, 1], [1, 1]],
        [[1, 0], [1, 1], [2, 1], [2, 2]],
        [[1, 0], [2, 0], [0, 1], [1, 1]],
        [[1, 0], [1, 1], [2, 1], [2, 2]]
    ],
    el: [
        [[1, 0], [1, 1], [1, 2], [2, 2]],
        [[2, 0], [0, 1], [1, 1], [2, 1]],
        [[0, 0], [1, 0], [1, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [0, 2]]
    ],
    invertedEl: [
        [[1, 0], [1, 1], [0, 2], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [2, 2]],
        [[1, 0], [2, 0], [1, 1], [1, 2]],
        [[0, 0], [0, 1], [1, 1], [2, 1]]
    ],
}