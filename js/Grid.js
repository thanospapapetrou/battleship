class Grid extends Array {
    constructor(width, height, clazz) {
        super();
        const table = document.createElement(Battleship.ELEMENT_TABLE);
        const headerRow = document.createElement(Battleship.ELEMENT_ROW);
        const headerCell = document.createElement(Battleship.ELEMENT_CELL);
        headerCell.classList.add(clazz);
        headerRow.appendChild(headerCell);
        for (let j = 0; j < width; j++) {
            const headerCell = document.createElement(Battleship.ELEMENT_CELL);
            headerCell.appendChild(document.createTextNode(Battleship.FORMAT_COLUMN(j)));
            headerCell.classList.add(clazz);
            headerRow.appendChild(headerCell);
        }
        table.appendChild(headerRow);
        for (let i = 0; i < height; i++) {
            this[i] = [];
            const row = document.createElement(Battleship.ELEMENT_ROW);
            const headerColumn = document.createElement(Battleship.ELEMENT_CELL);
            headerColumn.appendChild(document.createTextNode(Battleship.FORMAT_ROW(i)));
            headerColumn.classList.add(clazz);
            row.appendChild(headerColumn);
            for (let j = 0; j < width; j++) {
                this[i][j] = new Cell(clazz, row);
            }
            table.appendChild(row);
        }
        document.body.appendChild(table);
    }

    canPlace(i, j, direction, ship) {
        if (direction.check(i, j, ship)) {
            for (let k = 0; k < ship.size; k++) {
                const move = direction.move(i, j, k);
                if (this[move.i][move.j].ship && (this[move.i][move.j].ship != ship)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    renderShip(i, j, direction, ship) {
        this[i][j].ship = ship;
        for (let k = 1; k < ship.size; k++) {
            for (let dir of Object.values(Direction)) {
                const move = dir.move(i, j, k);
                if (dir == direction) {
                    this[move.i][move.j].ship = ship;
                } else if (this.canPlace(i, j, dir, ship)) {
                    this[move.i][move.j].content = null;
                }
            }
        }
    }

    castShadow(i, j, ship) {
        this[i][j].ship = ship;
        for (let k = 1; k < ship.size; k++) {
            for (let direction of Object.values(Direction)) {
                if (this.canPlace(i, j, direction, ship)) {
                    const move = direction.move(i, j, k);
                    this[move.i][move.j].shadow = ship;
                }
            }
        }
    }

    uncastShadow(i, j, ship) {
        this[i][j].content = null;
        for (let k = 1; k < ship.size; k++) {
            for (let direction of Object.values(Direction)) {
                if (this.canPlace(i, j, direction, ship)) {
                    const move = direction.move(i, j, k);
                    this[move.i][move.j].content = null;
                }
            }
        }
    }

    cancel(cancel) {
        for (let row of this) {
            for (let cell of row) {
                cell.cancel(cancel);
            }
        }
    }

    reset() {
        for (let row of this) {
            for (let cell of row) {
                cell.reset();
            }
        }
    }

    clear() {
        for (let row of this) {
            for (let cell of row) {
                cell.content = null;
            }
        }
    }
}
