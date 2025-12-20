
import { StowawayGame } from "src/game/stowaway/game";
import { Canvas } from "../canvas/canvas";
import { CVE } from "../canvas/cve";
import { Vector2 } from "../math/vector2";
import { Ticker } from "./ticker";

export abstract class BaseGame extends CVE {
    ticker: Ticker;
    constructor(c: HTMLCanvasElement) {
        super();

        window['$'] = {
            game: this as unknown as StowawayGame,
            canvas: new Canvas(c),
            tick: { deltaTime: 0, elapsedTime: 0, frameCount: 0 },
            container: new Vector2(c.width, c.height),
        }

        this.ticker = new Ticker();
        this.ticker.addCallback((data) => {
            $.tick = data;
            $.canvas.clear();
            this.tick();
        });
    }

    start() {
        this.ticker.start();
    }
}