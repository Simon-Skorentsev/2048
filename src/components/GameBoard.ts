import { Tile } from "./Tile";

//размер поля (4 на 4)
const GRID_SIZE = 4;
const CELL_SIZE = 15;
const CELL_GAP = 2;

// Игровое поле, содержет в себе массив клеток, позволяет получать массив клеток в нужном виде
export class GameBoard {
    private _cells: Cell[];

    constructor(gridElement: HTMLDivElement) {
        gridElement.style.setProperty("--grid-size", `${GRID_SIZE}`);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        this._cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(
                cellElement,
                index % GRID_SIZE,  //строка элемента - коорд x
                Math.floor(index / GRID_SIZE)  //столбец элемента - коорд y
            );
        });
    }

    get cells() {
        return this._cells;
    }

    //вернет распределенный по столбцам массив клеток формата [столб: [клетки столба]] 
    get cellsByColumn() {
        return this._cells.reduce((cellGrid: Array<Cell[]>, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];  //[0: []];
            cellGrid[cell.x][cell.y] = cell;            //[0: [0: Cell]]
            return cellGrid;
        }, []);
    }

    get cellsByRow() {
        return this._cells.reduce((cellGrid: Array<Cell[]>, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, []);
    }

    private get emptyCells() {
        return this.cells.filter(cell => cell.tile == null);
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
        return this.emptyCells[randomIndex];
    }
}

// Cell - клетка или же ячейка, наполняет собой игровую доску в кол-ве 16 штук (по умолчанию). Может содержать внутри себя Tile (плитку)
export class Cell {
    private _cellElement: HTMLDivElement;
    private _x: number;
    private _y: number;

    //плитка клетки (если есть)
    private _tile: Tile | null = null;
    //НИЖЕстоящая плитка (движ вверх), после соеденения с плиткой нашей клетки, удалится
    private _mergeTile: Tile | null = null;

    constructor(cellElement: HTMLDivElement, x: number, y: number) {
        this._cellElement = cellElement;
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get tile() {
        return this._tile;
    }

    //отвечает за появление плиток и их перемещение
    set tile(tile) {
        this._tile = tile;
        if (tile == null) return;
        this._tile.x = this._x;
        this._tile.y = this._y;
    }

    get mergeTile() {
        return this._mergeTile;
    }

    //забивает клетку на соеденение с конкретной плиткой (соеденятся они позже), это необходимо чтобы из 2→2→2→2 было 0 0 4 4, а не 0 0 0 8
    set mergeTile(value: Tile) {  //value - клетка что ниже
        this._mergeTile = value;
        if (value == null) return;
        //только чтобы начать transition переданной плитки
        this._mergeTile.x = this._x;
        this._mergeTile.y = this._y;
    }

    //может ли клетка принять плитку
    canAccept(tile: Tile) {
        return (
            this.tile == null ||  //да, если наша клетка пустая
            //да, если клетка уже не забита на соединение с другой плиткой и value плиток совпадают
            (this.mergeTile == null && this.tile.value === tile.value)
        );
    }

    //соеденит плитки
    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;
        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
    }

    //удаление плитки
    clear() {
        if (this.tile == null) return;
        this.tile.remove();
        this.tile = null;
    }
}

//cоздаст необходимо число клеток
function createCellElements(gridElement: HTMLDivElement) {
    const cells: HTMLDivElement[] = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}
