const table = document.querySelector(".playground > table");

const ROWS = 20;
const COLS = 10;


init();

function init() {
    for (let i = 0; i < ROWS; i++) {
        prependNewLine();
    }
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

function createNewBlock() {
    
}