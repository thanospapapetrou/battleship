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
    HARD: null,
    INSANE: (ocean) => [...ocean.keys()
        .flatMap((i) => ocean[i].keys()
            .filter((j) => ocean[i][j].ship)
            .map((j) => ({i, j})))][0]
});
