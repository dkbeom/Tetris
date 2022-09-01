import BLOCKS from "./blocks.js";

// DOM
const table = document.querySelector(".playground > table");
const scoreDisplay = document.querySelector(".score");

const ROWS = 20;
const COLS = 10;

let testMoving;
let score = 0;

const movingBlock = {
    type: "elRight",
    direction: 1,
    X: 0,
    Y: 0,
};


init();

function init() {
    testMoving = { ...movingBlock };
    for (let i = 0; i < ROWS; i++) {
        prependNewLine();
    }

    table.children[15].children[6].classList.add('seized');
    
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

// 블럭 렌더링
function renderBlock(move="", moveType="") {
    const {type, direction, X, Y} = movingBlock;
    // 기존 무빙 제거
    const moving = document.querySelectorAll(".moving");
    moving.forEach(movingElement=>{
        movingElement.classList.remove(type, "moving");
    })
    // 새 무빙 추가
    BLOCKS[type][direction].some(element=>{
        const x = element[0] + X;
        const y = element[1] + Y;
        // 블럭이 밑으로 내려오다 땅이나 블럭에 부딛혔을 때, seized 상태로 변환
        if(move === false && moveType === 'Y'){
            seizeBlock();
            checkMatch();
            createNewBlock();
            return true;
        } else {
            table.children[y].children[x].classList.add(type, "moving");
        }
    })
}

// 블럭이 불가능한지 테스트(불가능하면 true 반환)
function testBlock() {
    const {type, direction, X, Y} = movingBlock;
    return BLOCKS[type][direction].some(element=>{
        const x = element[0] + X;
        const y = element[1] + Y;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS || table.children[y].children[x].classList.contains('seized')) {
            // 테스트 불통
            console.log("testBlock 불통");
            return true;
        }
    })
}

// 블럭을 움직이는 함수
function moveBlock(moveType, amount) {
    let move = true;
    movingBlock[moveType] += amount;
    
    // 테스트 불통하면
    if(testBlock()){
        movingBlock[moveType] -= amount;
        move = false;
    }
    renderBlock(move, moveType);
}

// 블럭을 돌리는 함수
function changeDirection() {
    movingBlock["direction"] === 3 ? movingBlock["direction"] = 0 : movingBlock["direction"] += 1;
    
    // 테스트 불통하면
    if(testBlock()){
        movingBlock["direction"] === 0 ? movingBlock["direction"] = 3 : movingBlock["direction"] -= 1;
    }
    renderBlock();
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

// 새로운 블럭 생성
function createNewBlock() {
    const blockTypeList = Object.keys(BLOCKS);
    const random = Math.floor(Math.random() * blockTypeList.length);

    // 생성되는 새 블럭
    movingBlock.type = blockTypeList[random];
    movingBlock.direction = 0;
    movingBlock.X = 3;
    movingBlock.Y = 0;

    renderBlock(false, null);
}

document.addEventListener('keydown', e => {
    switch (e.keyCode) {
        // 오른쪽 화살표
        case 39:
            moveBlock('X', 1);
            break;
        // 왼쪽 화살표
        case 37:
            moveBlock('X', -1);
            break;
        // 아래쪽 화살표
        case 40:
            moveBlock('Y', 1);
            break;
        // 위쪽 화살표
        case 38:
            changeDirection();
            break;
        // 스페이스바
        case 32:

            break;
        default:
            break;
    }
})