class Fleet {
    static #CLASS_SELECTED = 'selected';
    static #FORMAT_HITS = (name, hits, size) => `${name}: ${size - hits}/${size}`;

    #names;
    #ships;
    #hits;

    constructor() {
        this.#names = [];
        this.#ships = [];
        this.#hits = [];
        const table = document.createElement(Battleship.ELEMENT_TABLE);
        for (let i = 0; i < Object.keys(Ship).length; i++) {
            this.#hits[i] = 0;
            const nameRow = document.createElement(Battleship.ELEMENT_ROW);
            this.#names[i] = document.createElement(Battleship.ELEMENT_CELL);
            this.#names[i].appendChild(document.createTextNode(Fleet.#FORMAT_HITS(Object.values(Ship)[i].name,
                    this.#hits[i], Object.values(Ship)[i].size)));
            this.#names[i].colSpan = Math.max(...Object.values(Ship).map((ship) => ship.size));
            nameRow.appendChild(this.#names[i]);
            table.appendChild(nameRow);
            this.#ships[i] = document.createElement(Battleship.ELEMENT_ROW);
            for (let j = 0; j < Object.values(Ship)[i].size; j++) {
                const shipCell = document.createElement(Battleship.ELEMENT_CELL);
                shipCell.appendChild(document.createTextNode(Object.values(Ship)[i].symbol));
                shipCell.classList.add(Battleship.CLASS_SHIP);
                this.#ships[i].appendChild(shipCell);
            }
            table.appendChild(this.#ships[i]);
        }
        document.body.appendChild(table);
    }

    select(ship) {
        for (let i = 0; i < Object.keys(Ship).length; i++) {
            if (ship == Object.values(Ship)[i]) {
                this.#ships[i].classList.add(Fleet.#CLASS_SELECTED);
            } else {
                this.#ships[i].classList.remove(Fleet.#CLASS_SELECTED);
            }
        }
    }

    hit(ship) {
        const i = Object.values(Ship).indexOf(ship);
        this.#names[i]?.removeChild(this.#names[i].firstChild);
        this.#names[i]?.appendChild(document.createTextNode(Fleet.#FORMAT_HITS(ship.name, ++this.#hits[i], ship.size)));
        this.#ships[i]?.children[this.#hits[i] - 1].removeChild(this.#ships[i].children[this.#hits[i] - 1].firstChild);
        this.#ships[i]?.children[this.#hits[i] - 1].appendChild(document.createTextNode(Battleship.CONTENT_EXPLOSION));
    }

    isSunk() {
        return this.#hits.reduce((a, b) => a + b) == Object.values(Ship).map((ship) => ship.size)
                .reduce((a, b) => a + b);
    }
}
