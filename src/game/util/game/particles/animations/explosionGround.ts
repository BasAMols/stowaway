
import { El } from "../../../html/el";
import { Sprite } from "../../../html/sprite";
import { Vector2 } from "../../../math/vector2";
import { Animation } from "./animation";

export class ExplosionGround extends Animation {
    public constructor(parent: El, position: Vector2, duration: number = 400, scale: number = 1, offsetStart: number = 0 ) {
        super(parent, new Sprite({
            image: 'dist/images/explosion/down.png',
            size: new Vector2(128, 128),
            columns: 12,
            rows: 1,
        }), position, duration, scale, offsetStart);
    }
}