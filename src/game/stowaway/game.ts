import { BaseGame } from "../util/game/baseGame";
import { Vector2 } from "../util/math/vector2";
import { Ship } from "./ship";
import { Sky } from "./env/sky";
import { Wave } from "./env/wave";

export class StowawayGame extends BaseGame {
    msPerDay: number = 60000;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        const sky = new Sky().add('sky', this, -1) as Sky;
        new Wave(new Vector2(0, 440 + 100), 7, 4, "#263342", 0.0005).add('wave1', this, 10);
        new Ship().add('ship', this, 35);
        new Wave(new Vector2(0, 600 + 100), 12, 2.4, "#263342", 0.0005).add('wave3D', this, 40);
        new Wave(new Vector2(0, 600 + 70), 14, 2, "#263342", 0.0003).add('wave3D2', this, 45).setOpacity(0.8);

        sky.overlays.forEach((overlay) => {
            overlay.element.add(overlay.name, this, overlay.order);
        });
    }

}