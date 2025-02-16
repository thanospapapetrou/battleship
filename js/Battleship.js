class Battleship {
    static #ELEMENT_CELL = 'td';
    static #ELEMENT_ROW = 'tr';
    static #ELEMENT_TABLE = 'table';
    static #HEIGHT = 10;
    static #OFFSET_COLUMN = 'A'.charCodeAt(0) - 1;
    static #SELECTOR_BODY = 'body';
    static #WIDTH = 10;

    static main() {
        new Battleship();
    }

    static #createGrid() {
        const grid = document.createElement(Battleship.#ELEMENT_TABLE);
        for (let i = 0; i <= Battleship.#WIDTH; i++) {
            const row = document.createElement(Battleship.#ELEMENT_ROW);
            for (let j = 0; j <= Battleship.#HEIGHT; j++) {
                const cell = document.createElement(Battleship.#ELEMENT_CELL);
                (i == 0) && (j != 0) && cell.appendChild(document.createTextNode(String.fromCharCode(Battleship.#OFFSET_COLUMN + j)));
                (j == 0) && (i != 0) && cell.appendChild(document.createTextNode(i));
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
        document.querySelector(Battleship.#SELECTOR_BODY).appendChild(grid);
    }

    static #createShipList() {
        const list = document.createElement(Battleship.#ELEMENT_TABLE);
        for (let ship of Object.values(Ship)) {
            const row = document.createElement(Battleship.#ELEMENT_ROW);
            for (let i = 0; i < ship.size; i++) {
                const cell = document.createElement(Battleship.#ELEMENT_CELL);
                cell.appendChild(document.createTextNode(ship.symbol));
                row.appendChild(cell);
            }
            list.appendChild(row);
        }
        document.querySelector(Battleship.#SELECTOR_BODY).appendChild(list);
    }

    constructor() {
        Battleship.#createGrid();
        Battleship.#createShipList();
        Battleship.#createGrid();
        Battleship.#createShipList();
    }
}