const Difficulty = Object.freeze({
    DUMMY: (ocean) => [...ocean.keys()
        .flatMap((i) => ocean[i].keys()
            .filter((j) => ocean[i][j].content != Battleship.CONTENT_EXPLOSION)
            .filter((j) => ocean[i][j].content != Battleship.CONTENT_WATER)
            .map((j) => ({i, j})))][0],
    EASY: (ocean) => {
        const cells = [...ocean.keys()
            .flatMap((i) => ocean[i].keys()
                .filter((j) => ocean[i][j].content != Battleship.CONTENT_EXPLOSION)
                .filter((j) => ocean[i][j].content != Battleship.CONTENT_WATER)
                .map((j) => ({i, j})))];
        return cells[Math.floor(Math.random() * cells.length)];
    },
    HARD: (ocean) => {
        const min = Math.min(...Object.values(Ship).map((ship) => ship.size));
        const max = Math.pow(2, Math.ceil(Math.log(Math.max(Battleship.WIDTH, Battleship.HEIGHT)) / Math.log(2)));
        const offsetX = (Battleship.WIDTH - max) / 2;
        const offsetY = (Battleship.HEIGHT - max) / 2;
        if (_hits.length) { // a ship is hit
            const firstShipHits = _findHits(_hits[0].ship);
            if (firstShipHits.length > 1) { // it's been hit multiple times; can determine direction
                const cells = [];
                if (_isHorizontal(_hits[0].ship)) {
                    for (let j = firstShipHits[0].j + 1; j < firstShipHits[1].j; j++) {
                        cells.push({i: firstShipHits[0].i, j});
                    }
                    const cell = cells
                            .filter((cell) => ocean[cell.i][cell.j].content != Battleship.CONTENT_EXPLOSION)
                            .filter((cell) => ocean[cell.i][cell.j].content != Battleship.CONTENT_WATER)[0];
                    if (cell) {
                        return _checkHit(ocean, cell);
                    }
                } else {

                }
            }
            const cell = [...Object.values(Direction)
                .map((direction) => direction.move(_hits[0].i, _hits[0].j, min))
                .filter((cell) => cell.i >= 0)
                .filter((cell) => cell.j < ocean.length)
                .filter((cell) => cell.j >= 0)
                .filter((cell) => cell.j < ocean[cell.i].length)
                .filter((cell) => ocean[cell.i][cell.j].content != Battleship.CONTENT_EXPLOSION)
                .filter((cell) => ocean[cell.i][cell.j].content != Battleship.CONTENT_WATER)][0];
                // TODO if no direction found yet, try hitting next cell
            if (cell) {
                return _checkHit(ocean, cell);
            }
        }
        const cells = [];
        for (let offset = 0; offset < min; offset++) {
            for (let step = max; step >= min; step /= 2) {
                for (let i = offsetY + offset; i < ocean.length; i += step) {
                    if (i >= 0) {
                        for (let j = offsetX + offset; j < ocean[i].length; j+= step) {
                            if (j >= 0) {
                                cells.push({i, j});
                            }
                        }
                    }
                }
            }
        }
        const cell = [...cells
            .filter(({i, j}) => ocean[i][j].content != Battleship.CONTENT_EXPLOSION)
            .filter(({i, j}) => ocean[i][j].content != Battleship.CONTENT_WATER)][0];
        return cell ? _checkHit(ocean, cell) : Difficulty.DUMMY(ocean);
    },
    INSANE: (ocean) => [...ocean.keys()
        .flatMap((i) => ocean[i].keys()
            .filter((j) => ocean[i][j].ship)
            .map((j) => ({i, j})))][0]
});

_hits = [];

function _checkHit(ocean, cell) {
    if (ocean[cell.i][cell.j].ship) {
        _hits.push({i: cell.i, j: cell.j, ship: ocean[cell.i][cell.j].ship});
        _hits.sort(_sortHits);
    }
    return cell;
}

function _findHits(ship) {
    return _hits.filter((hit) => hit.ship == ship);
}

function _isHorizontal(ship) {
    // TODO you can deduce it's horizontal by other hits hitting other ships
    const hits = _findHits(ship);
    return hits[0].i == hits[1].i;
}

function _sortHits(a, b) {
    const sizeComparison = a.ship.size - b.ship.size;
    if (sizeComparison == 0) {
        const iComparison = a.i - b.i;
        return (iComparison == 0) ? (a.j - b.j) : iComparison;
    }
    return sizeComparison;
}