import { Vector2 } from "src/game/util/math/vector2";
import { BaseCharacter } from "./baseCharacter";


export class PC extends BaseCharacter {
    speed: number = 700;

    constructor() {
        super();

        $.camera.addToZoomLayer(1.01, 'pc', this, 115);
        this.transform.setPosition(new Vector2(472, 934));
    }
}