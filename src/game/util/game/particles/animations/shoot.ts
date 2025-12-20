
import { El } from "../../../html/el";
import { Sprite } from "../../../html/sprite";
import { Vector2 } from "../../../math/vector2";
import { Animation } from "./animation";

export class ShootAnimation extends Animation {
    public constructor(parent: El, position: Vector2, duration: number = 100, scale: number = 1, offsetStart: number = 0 ) {
        super(parent, new Sprite({
            image: 'dist/images/ship/laser.png',
            size: new Vector2(211, 92),
            columns: 2,
            rows: 1,
        }), position, duration, scale, offsetStart);
    }
}