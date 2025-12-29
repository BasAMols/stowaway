
import { StowawayGame } from "src/game/stowaway/game";
import { Canvas } from "./canvas/canvas";
import { CVE } from "./canvas/cve";
import { Vector2 } from "./math/vector2";
import { Ticker } from "./ticker";
import { Loader } from "./canvas/loader";
import { MapManager } from "src/game/stowaway/characters/managers/mapManager";
import { PeopleManager } from "src/game/stowaway/characters/managers/peopleManager";
import { RouteManager } from "src/game/stowaway/characters/managers/routeManager";
import { DollarGlobal } from "./glob";
import { Keyboard } from "./keyboard";


export abstract class BaseGame<flags extends string, values extends string> extends CVE {
    ticker: Ticker;
    msPerDay: number = 600;
    keyboard: Keyboard;

    constructor(c: HTMLCanvasElement, public flags: Record<flags, boolean>, public values: Record<values, number>) {
        super();


        window['$'] = {
            canvas: new Canvas(c),
            tick: { deltaTime: 0, elapsedTime: 0, frameCount: 0 },
            container: new Vector2(c.width, c.height),
            day: 0,
            hour: 0,
            time: 0,
            loader: new Loader(),
            flags: this.flags,
            values: this.values,

        } as unknown as DollarGlobal;

        this.keyboard = new Keyboard($.canvas);
        $.keyboard = this.keyboard;

        this.ticker = new Ticker();
        this.ticker.addCallback((data) => {
            $.tick = data;
            $.canvas.clear();
            // $.day = $.tick.elapsedTime / this.msPerDay;
            $.day = 0.8;
            $.hour = $.day * 24;
            $.time = $.hour % 24;
            this.tick();
        });

        if (import.meta.hot) {
            import.meta.hot.on('vite:beforeUpdate', () => {
                location.reload()
            })
        }
    }

    start() {
        $.loader.setup = true;
        if ($.loader.ready) {
            this.loaded();
            this.ticker.start();
        } else {
            setTimeout(() => {
                this.start();
            }, 100);
        }
    }

    tick() {
        $.keyboard.tick();
        super.tick();
    }

    toggleflag(flag: flags) {
        this.flags[flag] = !this.flags[flag];
        this.applyFlags();
    }
    abstract applyFlags(): void;
}