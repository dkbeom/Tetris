import BLOCKS from "./blocks.js";

// DOM
const table = document.querySelector(".playground > table");

const ROWS = 20;
const COLS = 10;

let testMoving;

const movingBlock = {
    type: "tree",
    direction: 0,
    X: 0,
    Y: 0,
};


init();

function init() {
    testMoving = { ...movingBlock };
    for (let i = 0; i < ROWS; i++) {
        prependNewLine();
    }

    console.log(table);
    table.children[0].children[1].classList.add('tree');
    //console.log(table.children[0].children[2].classList.contains('tree'));

    // createNewBlock();
    // renderBlock();
    // testBlock();
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
    const blockList = Object.keys(BLOCKS);
    const random = Math.floor(Math.random() * blockList.length);

    // 랜덤으로 정해진 블록타입
    blockList[random];
}

// 블럭 렌더링
function renderBlock() {
    const moving = document.querySelectorAll('.moving');
    
}

// 블럭이 가능한지 테스트
function testBlock() {
    // const {type, direction, X, Y} = testMoving;
    const {type, direction, X, Y} = movingBlock;
    console.log(BLOCKS[type][direction]);
    BLOCKS[type][direction].forEach(element=>{
        const x = element[0] + X;
        const y = element[1] + Y;
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS || table.children[x].children[y].classList.contains('seized')) {
            // 테스트 불통
            return false;
        } else {
            return true;
        }
    })
}

// 블럭을 움직이는 함수
function moveBlock(moveType, amount) {
    movingBlock[moveType] += amount;
    // 테스트 불통하면
    if(!testBlock()){
        movingBlock[moveType] -= amount;
    }
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

            break;
        // 스페이스바
        case 32:

            break;
        default:
            break;
    }
})