class Cell {
    static #CLASS_SHADOW = 'shadow';
    static #CURSOR_CELL = 'cell';
    static #CURSOR_CROSSHAIR = 'crosshair';
    static #CURSOR_DEFAULT = 'default';
    static #CURSOR_NOT_ALLOWED = 'not-allowed';

    #cell;

    constructor(clazz, parent) {
        this.#cell = document.createElement(Battleship.ELEMENT_CELL);
        this.#cell.classList.add(clazz);
        parent.appendChild(this.#cell);
    }

    get content() {
        return this.#cell.firstChild?.nodeValue;
    }

    set content(content) {
        this.#cell.firstChild && this.#cell.removeChild(this.#cell.firstChild);
        content && this.#cell.appendChild(document.createTextNode(content));
        this.#cell.classList.remove(Battleship.CLASS_SHIP);
        this.#cell.classList.remove(Cell.#CLASS_SHADOW);
    }

    set clazz(clazz) {
        this.#cell.classList.add(clazz);
    }

    get ship() {
        return Object.values(Ship).find(ship => ship.symbol == this.content);
    }

    set ship(ship) {
        this.content = ship.symbol;
        this.clazz = Battleship.CLASS_SHIP;
    }

    set shadow(ship) {
        this.content = ship.symbol;
        this.clazz = Cell.#CLASS_SHADOW;
    }

    castShadow(cast, uncast, place) {
        this.recastShadow(cast);
        this.#cell.onmouseout = uncast;
        this.#cell.onmousedown = place;
    }

    recastShadow(recast) {
        this.#cell.style.cursor = Cell.#CURSOR_CELL;
        this.#cell.onmouseenter = recast;
    }

    placeShip(place, next) {
        this.#cell.style.cursor = Cell.#CURSOR_CELL;
        this.#cell.onmouseenter = place;
        this.#cell.onmouseup = next;
    }

    fire(fire) {
        this.#cell.style.cursor = Cell.#CURSOR_CROSSHAIR;
        this.#cell.onclick = fire;
    }

    cancel(cancel) {
        this.disable();
        this.#cell.onmouseup = cancel;
    }

    disable() {
        this.#cell.onmouseenter = null;
        this.#cell.onmouseout = null;
        this.#cell.onmousedown = null;
        this.#cell.onmouseup = null;
        this.#cell.onclick = null;
        this.#cell.style.cursor = Cell.#CURSOR_NOT_ALLOWED;
    }

    reset() {
        this.disable();
        this.#cell.style.cursor = Cell.#CURSOR_DEFAULT;
    }
}
