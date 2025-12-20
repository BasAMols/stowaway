import { El, ElOptions } from "../../../html/el";
import { Sprite } from "../../../html/sprite";
import { Vector2 } from "../../../math/vector2";
import { Particle } from "./particle";

export class Bullet extends Particle {
    public constructor(parent: El, velocity: Vector2, scaleMultiplier: number = 1, options: ElOptions = {}) {
        super(parent, {
            velocity: velocity.multiply(scaleMultiplier),
            acceleration: 1,
            lifespan: 5000,
            scale: new Vector2(4 * scaleMultiplier, 4 * scaleMultiplier),
            asset: {
                element: new Sprite({
                    image: 'dist/images/ship/laserout1-sheet.png',
                    size: new Vector2(11, 10),
                    columns: 2,
                    rows: 1,
                }),
                duration: 70,
            },
            ...options,
        });
    }
}