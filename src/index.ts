import { Cell, GameBoard } from "./components/GameBoard";
import { WaitAnimationPromise, Tile } from "./components/Tile";
import "index.css";

const gameBoardElement = document.createElement("div");
gameBoardElement.classList.add("game-board");
document.body.append(gameBoardElement);

const gameBoard = new GameBoard(gameBoardElement);
//первые 2 плитки в начале игры
gameBoard.randomEmptyCell().tile = new Tile(gameBoardElement);
gameBoard.randomEmptyCell().tile = new Tile(gameBoardElement);
//ожидание первого ввода
waitNextInput();

//один игровой ход
async function handleInput(e: KeyboardEvent) {
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                waitNextInput();
                return;
            }
            //передвинет все плитки вверх
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()) {
                waitNextInput();
                return;
            }
            await moveDown();
            break;
        case "ArrowLeft":
            if (!canMoveLeft()) {
                waitNextInput();
                return;
            }
            await moveLeft();
            break;
        case "ArrowRight":
            if (!canMoveRight()) {
                waitNextInput();
                return;
            }
            await moveRight();
            break;
        //если кнопка нам не интересна, ждем пока не нажмут нужную
        default:
            waitNextInput();
            return;
    }

    //соеденит все плитки с парами, образованными после передвижения
    gameBoard.cells.forEach(cell => cell.mergeTiles());

    //каждый новый ход (в нашем случае в конце старого) необходимо создавать новую плитку
    const newTile = new Tile(gameBoardElement);
    gameBoard.randomEmptyCell().tile = newTile;

    //gameover
    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then((e) => {  //дожидаемся анимации спавна последней плитки
            console.log(e);
            alert("You lose");
        });
        return;
    }

    //ждем слендующего хода
    waitNextInput();
}

function waitNextInput() {
    window.addEventListener("keydown", handleInput, { once: true });
}

//передвинет все плитки в нужную сторону; образует пары плиток, которые в будущем соеденятся
function slideTiles(cells: Array<Cell[]>) {
    //после того как все плитки закончат движение
    return Promise.all(
        cells.flatMap(group => {
            const promises: WaitAnimationPromise[] = [];

            for (let i = 1; i < group.length; i++) {
                const cell = group[i];

                if (cell.tile == null) continue;
                //вышестоящая клетка, доступная для перемещения
                let lastValidCell: null | Cell = null;
                for (let j = i - 1; j >= 0; j--) {
                    //клетка, что выше по движению
                    const moveToCell = group[j];
                    //если выше на 1кл нельзя => на 2, 3 клетки тоже нельзя
                    if (!moveToCell.canAccept(cell.tile)) break;
                    lastValidCell = moveToCell;
                }

                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition());
                    
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile;
                    } else {
                        lastValidCell.tile = cell.tile;
                    }
                    //finaly плитка переместилась, ее в этой клетке больше нет
                    cell.tile = null;
                }
            }
            return promises;
        })
    );
}

function moveUp() {
    return slideTiles(gameBoard.cellsByColumn);
}

function moveDown() {
    return slideTiles(gameBoard.cellsByColumn.map(column => [...column].reverse()));
}

function moveLeft() {
    return slideTiles(gameBoard.cellsByRow);
}

function moveRight() {
    return slideTiles(gameBoard.cellsByRow.map(row => [...row].reverse()));
}

function canMove(cells: Array<Cell[]>) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false;
            if (cell.tile == null) return false;
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile);
        });
    });
}

function canMoveUp() {
    return canMove(gameBoard.cellsByColumn);
}

function canMoveDown() {
    return canMove(gameBoard.cellsByColumn.map(column => [...column].reverse()));
}

function canMoveLeft() {
    return canMove(gameBoard.cellsByRow);
}

function canMoveRight() {
    return canMove(gameBoard.cellsByRow.map(row => [...row].reverse()));
}
