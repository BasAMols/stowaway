
import { StowawayGame } from "src/game/stowaway/game";
import { Canvas } from "../canvas/canvas";
import { CVE } from "../canvas/cve";
import { Vector2 } from "../math/vector2";
import { Ticker } from "./ticker";
import { Loader } from "../canvas/loader";


export abstract class BaseGame<flags extends string> extends CVE {
    ticker: Ticker;
    msPerDay: number = 600;

    constructor(c: HTMLCanvasElement, public flags: Record<flags, boolean>) {
        super();

        window['$'] = {
            game: this as unknown as StowawayGame,
            canvas: new Canvas(c),
            tick: { deltaTime: 0, elapsedTime: 0, frameCount: 0 },
            container: new Vector2(c.width, c.height),
            day: 0,
            loader: new Loader(),
            flags: this.flags,
        }

        this.ticker = new Ticker();
        this.ticker.addCallback((data) => {
            $.tick = data;
            $.canvas.clear();
            $.day = $.tick.elapsedTime / this.msPerDay;
            this.tick();
        });
    }

    start() {
        $.loader.setup = true;
        if ($.loader.ready) {
            this.ticker.start();
        } else {
            setTimeout(() => {
                this.start();
            }, 100);
        }
    }

    toggleflag(flag: flags) {
        this.flags[flag] = !this.flags[flag];
        this.applyFlags();
    }
    abstract applyFlags(): void;
}