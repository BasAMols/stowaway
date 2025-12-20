import { BaseGame } from "../util/game/baseGame";
import { Vector2 } from "../util/math/vector2";
import { Ship } from "./ship";
import { Sky } from "./env/sky";
import { Wave } from "./env/wave";

export class StowawayGame extends BaseGame {
    duration: number = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        new Sky().add('sky', this, -1);
        new Wave(new Vector2(0, 440 + 100), 10, 4, "#0000aa", 0.0005).add('wave1', this, 10);
        new Wave(new Vector2(0, 500 + 100), 20, 3.5, "#0000cc", 0.0005).add('wave2', this, 20);
        new Wave(new Vector2(0, 570 + 100), 30, 2.8, "#0000ee", 0.0005).add('wave3', this, 30);
        new Ship().add('ship', this, 35);
        new Wave(new Vector2(0, 600 + 100), 30, 2.8, "#0000ee", 0.0005).add('wave3D', this, 40);
    }

    preRender(): void {
        this.duration += $.tick.deltaTime;
    }

    override render(): void {
    }
}