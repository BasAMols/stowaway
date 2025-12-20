
import { Canvas } from "../canvas/canvas";
import { CVE } from "../canvas/cve";
import { Ticker } from "./ticker";

export class Game extends CVE {
    ticker: Ticker;
    constructor() {
        super();

        game = this;
        canvas = new Canvas();
        tick = { deltaTime: 0, elapsedTime: 0, frameCount: 0 };

        this.ticker = new Ticker();
        this.ticker.addCallback((data) => {
            tick = data;
            this.tick();
        });
    }

    start() {
        this.ticker.start();
    }
}