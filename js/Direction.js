const Direction = Object.freeze({
    NORTH: {check: (i, j, ship) => i - ship.size + 1 >= 0, move: (i, j, k) => ({i: i - k, j})},
    EAST: {check: (i, j, ship) => j + ship.size - 1 < Battleship.WIDTH, move: (i, j, k) => ({i, j: j + k})},
    SOUTH: {check: (i, j, ship) => i + ship.size - 1 < Battleship.HEIGHT, move: (i, j, k) => ({i: i + k, j})},
    WEST: {check: (i, j, ship) => j - ship.size + 1 >= 0, move: (i, j, k) => ({i, j: j - k})}
});
