class Timer {
    static #ELEMENT_PARAGRAPH = 'p';
    static #FORMAT = (min, s) => `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    static #MS_PER_S = 1000;
    static #S_PER_MIN = 60;

    #paragraph;
    #start;
    #interval;

    constructor() {
        this.#paragraph = document.createElement(Timer.#ELEMENT_PARAGRAPH);
        document.body.appendChild(this.#paragraph);
        this.#start = null;
        this.#interval = null;
    }

    start() {
        this.#start = new Date();
        this.#interval = setInterval(this.#update.bind(this), Timer.#MS_PER_S);
    }

    stop() {
        clearInterval(this.#interval);
    }

    #update() {
        this.#paragraph.firstChild && this.#paragraph.removeChild(this.#paragraph.firstChild);
        const seconds = Math.floor((new Date() - this.#start) / Timer.#MS_PER_S);
        this.#paragraph.appendChild(document.createTextNode(Timer.#FORMAT(
                Math.floor(seconds / Timer.#S_PER_MIN), seconds % Timer.#S_PER_MIN)));
    }
}