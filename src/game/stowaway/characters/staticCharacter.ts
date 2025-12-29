import { Vector2 } from "src/game/util/math/vector2";
import { AnimationKeys, BaseCharacter } from "./baseCharacter";


export class StaticCharacter extends BaseCharacter {

    constructor(position: Vector2, key: string, private depth: number, private active: AnimationKeys, private flip: boolean,) {
        super([active]);

        $.camera.addToZoomLayer(depth, key, this, 100);
        this.transform.setPosition(position);

    }

    preTransform(): void {
        this.sprites[this.active].flip = this.flip;
        this.sprites[this.active].preRender();
        this.activeSprite = this.sprites[this.active];

        if (this.depth > 1.029) {
            this.opacity = $.flags.open ? 0 : 1;
        }
    }

}