import { Div } from "../../../html/div";
import { El } from "../../../html/el";
import { Sprite } from "../../../html/sprite";
import { Vector2 } from "../../../math/vector2";

export class Animation extends Div {

    private start: number;
    public position: Vector2;

    public constructor(private parent: El, private asset: Sprite, position: Vector2, private duration: number, scale: number = 1, private offsetStart: number = 0) {
        super({
            scale: new Vector2(scale, scale),
            position: position,
            anchor: new Vector2(0.5, 0.5),
        });
        this.append(this.asset);
        this.start = $.time - offsetStart;
        parent.append(this);
    }

    tick() {
        super.tick();
        const progress = ($.time - this.start) / this.duration;
        this.asset.factor = progress;
        if (progress >= 1) {
            this.remove();
        }
    }

    remove() {
        this.parent.removeChild(this);
    }
}