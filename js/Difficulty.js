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
        for (let ship of Object.values(Ship).filter((ship) => !_isSunk(ship)).sort((a, b) => a.size - b.size)) {
            const hits = _hits.filter((hit) => hit.ship == ship);
            if (hits.length) {
                if (_isHorizontal(ocean, hits[0].ship)) {
                    const cell = _pinpointHorizontal(ocean, min, hits[0]).filter((cell) => _isValid(ocean, cell))[0];
                    if (cell) {
                        return _checkHit(ocean, cell);
                    }
                }
                if (_isVertical(ocean, hits[0].ship)) {
                    const cell = _pinpointVertical(ocean, min, hits[0]).filter((cell) => _isValid(ocean, cell))[0];
                    if (cell) {
                        return _checkHit(ocean, cell);
                    }
                }
                const cell = _pinpoint(ocean, min, hits[0]).filter((cell) => _isValid(ocean, cell))[0];
                if (cell) {
                    return _checkHit(ocean, cell);
                }
            }
        }
        const cell = _pattern(ocean, min).filter((cell) => _isValid(ocean, cell))[0];
        return _checkHit(ocean, cell ? cell : Difficulty.DUMMY(ocean));
    },
    INSANE: (ocean) => [...ocean.keys()
        .flatMap((i) => ocean[i].keys()
            .filter((j) => ocean[i][j].ship)
            .map((j) => ({i, j})))][0]
});

_hits = [];

function _pattern(ocean, min) {
    const max = min * Math.pow(2, Math.ceil(Math.log(Math.max(ocean.length, ocean[0].length) / min) / Math.log(2)));
    const offsetX = Math.floor((Battleship.WIDTH - max) / 2);
    const offsetY = Math.floor((Battleship.HEIGHT - max) / 2);
    const cells = [];
    for (let offset = 0; offset < min; offset++) {
        for (let step = max; step >= min; step /= 2) {
            for (let i = offsetY + offset; i < ocean.length; i += step) {
                for (let j = offsetX + offset; j < ocean[0].length; j+= step) {
                    cells.push({i, j});
                }
            }
        }
    }
    return cells;
}

function _pinpoint(ocean, min, hit) {
    const cells = [];
    for (let direction of Object.values(Direction)) {
        cells.push(direction.move(hit.i, hit.j, (hit.ship.size > min) ? min : 1));
    }
    return cells;
}

function _pinpointHorizontal(ocean, min, hit) {
    const west = _hits.filter((h) => h.ship == hit.ship).sort((a, b) => a.j - b.j)[0].j;
    const east = _hits.filter((h) => h.ship == hit.ship).sort((a, b) => b.j - a.j)[0].j;
    const cells = [];
    for (let j = west + 1; j < east; j++) {
        cells.push({i: hit.i, j});
    }
    cells.push(Direction.EAST.move(hit.i, east, (east - west + min < hit.ship.size) ? min : 1));
    cells.push(Direction.WEST.move(hit.i, west, (east - west + min < hit.ship.size) ? min : 1));
    return cells;
}

function _pinpointVertical(ocean, min, hit) {
    const north = _hits.filter((h) => h.ship == hit.ship).sort((a, b) => a.i - b.i)[0].i;
    const south = _hits.filter((h) => h.ship == hit.ship).sort((a, b) => b.i - a.i)[0].i;
    const cells = [];
    for (let i = north + 1; i < south; i++) {
        cells.push({i, j: hit.j});
    }
    cells.push(Direction.NORTH.move(north, hit.j, (south - north + min < hit.ship.size) ? min : 1));
    cells.push(Direction.SOUTH.move(south, hit.j, (south - north + min < hit.ship.size) ? min : 1));
    return cells;
}

function _isSunk(ship) {
    return _hits.filter((hit) => hit.ship == ship).length == ship.size;
}

function _isHorizontal(ocean, ship) {
    const hits = _hits.filter((hit) => hit.ship == ship);
    if (hits.length > 1) {
        return hits[0].i == hits[1].i;
    }
    let previous = null;
    for (let i = 0; i < hits[0].i; i++) {
        if ((ocean[i][hits[0].j].content == Battleship.CONTENT_EXPLOSION)
                || (ocean[i][hits[0].j].content == Battleship.CONTENT_WATER)) {
            previous = i;
        }
    }
    let next = null;
    for (let i = hits[0].i + 1; i < ocean.length; i++) {
        if ((ocean[i][hits[0].j].content == Battleship.CONTENT_EXPLOSION)
                || (ocean[i][hits[0].j].content == Battleship.CONTENT_WATER)) {
            next = i;
        }
    }
    return (previous && next && (next - previous <= ship.size)) ? true : null;
}

function _isVertical(ocean, ship) {
    const hits = _hits.filter((hit) => hit.ship == ship);
    if (hits.length > 1) {
        return hits[0].j == hits[1].j;
    }
    let previous = null;
    for (let j = 0; j < hits[0].j; j++) {
        if ((ocean[hits[0].i][j].content == Battleship.CONTENT_EXPLOSION)
                || (ocean[hits[0].i][j].content == Battleship.CONTENT_WATER)) {
            previous = j;
        }
    }
    let next = null;
    for (let j = hits[0].j + 1; j < ocean.length; j++) {
        if ((ocean[hits[0].i][j].content == Battleship.CONTENT_EXPLOSION)
                || (ocean[hits[0].i][j].content == Battleship.CONTENT_WATER)) {
            next = j;
        }
    }
    return (previous && next && (next - previous <= ship.size)) ? true : null;
}

function _isValid(ocean, cell) {
    return (cell.i >= 0) && (cell.i < ocean.length) && (cell.j >= 0) && (cell.j < ocean[cell.i].length)
            && (ocean[cell.i][cell.j].content != Battleship.CONTENT_EXPLOSION)
            && (ocean[cell.i][cell.j].content != Battleship.CONTENT_WATER);
}

function _checkHit(ocean, cell) {
    (ocean[cell.i][cell.j].ship) && _hits.push({i: cell.i, j: cell.j, ship: ocean[cell.i][cell.j].ship});
    return cell;
}
