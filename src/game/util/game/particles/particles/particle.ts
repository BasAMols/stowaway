import { Div } from "../../../html/div";
import { El, ElOptions } from "../../../html/el";
import { Sprite } from "../../../html/sprite";
import { Vector2 } from "../../../math/vector2";

export class Particle extends Div {

    private time: number = 0;
    private velocity: Vector2;
    private acceleration: number;
    private lifespan: number;
    private asset: {
        element: Sprite;
        duration: number;
    } | {
        element: Div;
    };

    public constructor(private parent: El, options: {
        velocity: Vector2;
        acceleration: number;
        lifespan: number;
        asset: {
            element: Sprite;
            duration: number;
        } | {
            element: Div;
        }
    } & ElOptions) {
        super({
            ...options,
        });
        this.velocity = options.velocity;
        this.acceleration = options.acceleration || 1;
        this.lifespan = options.lifespan;
        this.asset = options.asset;
        this.time = $.time;

        this.append(this.asset.element);
        this.parent.append(this);
    }

    tick() {
        super.tick();
        this.velocity = this.velocity.multiply(this.acceleration);
        this.transform.move(this.velocity);

        if ('duration' in this.asset) {
            this.asset.element.factor = ($.time / this.asset.duration) % this.asset.element.max;
        }

        if ($.time > this.time + this.lifespan) {
            this.parent.removeChild(this);
        }

    }
}