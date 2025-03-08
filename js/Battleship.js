class Battleship {
    static CLASS_SHIP = 'ship';
    static CONTENT_EXPLOSION = '💥';
    static CONTENT_WATER = '🌊';
    static ELEMENT_CELL = 'td';
    static ELEMENT_ROW = 'tr';
    static ELEMENT_TABLE = 'table';
    static HEIGHT = 10;
    static WIDTH = 10;

    static #BUTTON_LEFT = 0;
    static #CLASS_OCEAN = 'ocean';
    static #CLASS_RADAR = 'radar';

    static #CONTENT_X = '❌';
    static #DISPLAY_NONE = 'none';
    static #MESSAGE_LOST = 'You lost!';
    static #MESSAGE_WON = 'You won!';
    static #PARAMETER_DIFFICULTY = 'difficulty';
    static #SELECTOR_FORM = 'form';

    #ocean;
    #friendlyFleet;
    #radar;
    #enemyFleet;
    #enemy;
    #difficulty;

    static main() {
        // TODO reduce for loops
        const difficulty = Difficulty[new URLSearchParams(location.search).get(Battleship.#PARAMETER_DIFFICULTY)];
        if (difficulty) {
            document.querySelector(Battleship.#SELECTOR_FORM).style.display = Battleship.#DISPLAY_NONE;
            new Battleship(difficulty).placeShip(Ship.CARRIER);
        }
    }

    constructor(difficulty) {
        this.#ocean = new Grid(Battleship.WIDTH, Battleship.HEIGHT, Battleship.#CLASS_OCEAN);
        this.#friendlyFleet = new Fleet();
        this.#radar = new Grid(Battleship.WIDTH, Battleship.HEIGHT, Battleship.#CLASS_RADAR);
        this.#enemyFleet = new Fleet();
        this.#enemy = [];
        this.#difficulty = difficulty;
    }

    placeShip(ship) {
        this.#friendlyFleet.select(ship);
        for (let i = 0; i < this.#ocean.length; i++) {
            for (let j = 0; j < this.#ocean[i].length; j++) {
                this.#ocean[i][j].disable();
                if (Object.values(Direction).some(direction => this.#ocean.canPlace(i, j, direction, ship))) {
                    this.#ocean[i][j].castShadow((event) => this.#ocean.castShadow(i, j, ship),
                            (event) => this.#ocean.uncastShadow(i, j, ship),
                            (event) => ((event.button == Battleship.#BUTTON_LEFT) && this.#placeShip(i, j, ship)));
                }
            }
        }
    }

    play() {
        this.#friendlyFleet.select(null);
        this.#placeEnemyFleet();
        this.#cheat();
        this.#ocean.reset();
        for (let i = 0; i < this.#radar.length; i++) {
            for (let j = 0; j < this.#radar[i].length; j++) {
                this.#radar[i][j].fire((event) => this.fire(i, j));
                // TODO start timer
            }
        }
    }

    fire(i, j) {
        this.#radar[i][j].disable();
        const enemyShip = this.#enemy[i][j];
        this.#radar[i][j].content = enemyShip ? Battleship.CONTENT_EXPLOSION : Battleship.#CONTENT_X;
        this.#enemyFleet.hit(enemyShip);
        if (this.#enemyFleet.isSunk()) {
            // TODO stop timer
            this.#radar.reset();
            alert(Battleship.#MESSAGE_WON);
        } else {
            const enemyFire = this.#difficulty(this.#ocean);
            const friendlyShip = this.#ocean[enemyFire.i][enemyFire.j].ship;
            this.#ocean[enemyFire.i][enemyFire.j].content = friendlyShip
                    ? Battleship.CONTENT_EXPLOSION : Battleship.CONTENT_WATER;
            this.#ocean[enemyFire.i][enemyFire.j].clazz = friendlyShip ? Battleship.CLASS_SHIP : null;
            this.#friendlyFleet.hit(friendlyShip);
            if (this.#friendlyFleet.isSunk()) {
                // TODO stop timer
                this.#radar.reset();
                alert(Battleship.#MESSAGE_LOST);
            }
        }
    }

    #nextStep(ship) {
        const next = Object.values(Ship).indexOf(ship) + 1;
        (next < Object.values(Ship).length) ? this.placeShip(Object.values(Ship)[next]) : this.play();
    }

    #cancel(ship) {
        for (let row of this.#ocean) {
            for (let cell of row) {
                (cell.ship == ship) && (cell.content = null);
            }
        }
        this.placeShip(ship);
    }

    #placeShip(i, j, ship) {
        this.#ocean.cancel((event) => this.#cancel(ship));
        this.#ocean[i][j].recastShadow((event) => this.#ocean.castShadow(i, j, ship));
        for (let k = 1; k < ship.size; k++) {
            for (let direction of Object.values(Direction)) {
                if (this.#ocean.canPlace(i, j, direction, ship)) {
                    const move = direction.move(i, j, k);
                    this.#ocean[move.i][move.j].placeShip((event) => this.#ocean.renderShip(i, j, direction, ship),
                            (event) => this.#nextStep(ship));
                }
            }
        }
    }

    #placeEnemyFleet() {
        for (let i = 0; i < this.#radar.length; i++) {
            this.#enemy[i] = [];
            for (let j = 0; j < this.#radar[i].length; j++) {
                this.#enemy[i][j] = null;
            }
        }
        for (let ship of Object.values(Ship)) {
            const place = this.#placeEnemyShip(ship);
            for (let k = 0; k < ship.size; k++) {
                const move = place.direction.move(place.i, place.j, k);
                this.#enemy[move.i][move.j] = ship;
            }
        }
        this.#radar.clear();
    }

    #placeEnemyShip(ship) {
        const i = Math.floor(Math.random() * this.#radar.length);
        const j = Math.floor(Math.random() * this.#radar[i].length);
        const direction = Object.values(Direction)[Math.floor(Math.random() * Object.keys(Direction).length)];
        if (this.#radar.canPlace(i, j, direction, ship)) {
            this.#radar.renderShip(i, j, direction, ship);
            return {i, j, direction};
        }
        return this.#placeEnemyShip(ship);
    }

    #cheat() { // TODO render rows and columns
        console.log('┌' + Array(Battleship.WIDTH).fill('─').join('┬') + '┐\n│'
            + this.#enemy.map(r => r.map(c => c ? c.symbol : ' ').join('│')).join('│\n├' + Array(Battleship.WIDTH).fill('─').join('┼') + '┤\n│')
            + '│\n└' + Array(Battleship.WIDTH).fill('─').join('┴') + '┘');
    }

//    #hard() {
//        const min = Math.min(...Object.values(Ship).map((ship) => ship.size));
//        const max = Math.pow(2, Math.ceil(Math.log(Math.max(Battleship.WIDTH, Battleship.HEIGHT)) / Math.log(2)));
//        const offsetX = (Battleship.WIDTH - max) / 2;
//        const offsetY = (Battleship.HEIGHT - max) / 2;
//        for (let offset = 0; offset < min; offset++) {
//            for (let step = max; step >= min; step /= 2) {
//                for (let i = offsetY + offset; i < Battleship.HEIGHT; i += step) {
//                    for (let j = offsetX + offset; j < Battleship.WIDTH; j+= step) {
//                        if (this.#hardIsValid(i, j)) {
//                            return {i, j};
//                        }
//                    }
//                }
//            }
//        }
//    }
//
//    #hardIsValid(i, j) {
//        if ((i < 0) || (i >= Battleship.HEIGHT) || (j < 0) || (j >= Battleship.WIDTH)) {
//            return false;
//        }
//        const content = this.#ocean.children[i + 1].children[j + 1].content;
//        return (content != Battleship.CONTENT_EXPLOSION) && (content != Battleship.#CONTENT_WATER);
//    }
}

