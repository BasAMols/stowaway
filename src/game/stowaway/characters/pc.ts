import { Vector2 } from "src/game/util/math/vector2";
import { BaseCharacter } from "./baseCharacter";
import { Animator } from "./character";
import { CVE } from "src/game/util/canvas/cve";
import { Canvas } from "src/game/util/canvas/canvas";
import { ShipPart } from "../ship";
import { Utils } from "src/game/util/math/util";



export class PC extends BaseCharacter {
    speed: number = 0.5;
    targetPosition: Vector2;
    running: boolean = false;
    target: Target;
    front

    constructor() {
        super();

        $.camera.createDynamicLayer('pc', 1.02, this, 115);
        // $.camera.addToZoomLayer(1.02, 'pc', this, 115);
        $.camera.addToZoomLayer(1.02, 'target', (this.target = new Target()), 114);

        this.transform.setPosition(new Vector2(602, 934));

        $.mouse.registerClickListener((position) => {
            this.targetPosition = $.areaManager.target(position)?.[0];
            this.target.target = this.targetPosition;
            this.target.visible = true;
            if ($.keyboard.pressed('shift')) {
                this.running = true;
            }
        });
        $.mouse.registerDoubleClickListener((position) => {
            this.running = true;
        });
        $.mouse.registerNoDoubleClickListener((position) => {
            if (!$.keyboard.pressed('shift')) {
                this.running = false;
            }
        });

    }
    flip(b: boolean) {
        Object.values(this.sprites).forEach(sprite => sprite.flip = b);
    }
    prep(sprite: Animator) {
        sprite.preRender();
        this.activeSprite = sprite;
    }
    preTransform(): void {

        const target = $.areaManager.target(this.transform.position);
        if (target) {
            $.camera.setDynamicLayerParallax('pc', target[1]);
        }

        // if (this.targetPosition) {
        //     const speed = this.running ? this.speed * 3 : this.speed;
        //     if (this.targetPosition.subtract(this.transform.position).magnitude() < speed / $.tick.deltaTime) {
        //         this.transform.setPosition(this.targetPosition);
        //         this.targetPosition = undefined;
        //         this.running = false;
        //         this.target.visible = false;
        //     } else {
        //         this.transform.setPosition(this.transform.position.moveTowards(this.targetPosition, speed * $.tick.deltaTime));
        //     }
        // }
        const newPosition = this.transform.position;
        const lastPosition = this.lastPosition;
        if (lastPosition.subtract(newPosition).magnitude() > 0) {
            this.flip(this.transform.position.subtract(lastPosition).normalise().x < 0);
            if (this.running) {
                this.prep(this.sprites.run);
            } else {
                this.prep(this.sprites.walk);
            }
        } else {
            this.prep(this.sprites.idle);
        }
        this.transform.setPosition(newPosition);
        this.lastPosition = this.transform.position;
    }
}

export class Target extends CVE {
    constructor() {
        super();
        this.opacity = 0.5;
    }
    target: Vector2;
    visible: boolean = false;

    render() {
        return
        if (!this.target || !this.visible) return;

        $.canvas.save();
        $.canvas.move(this.target);
        $.canvas.scale(new Vector2(1, 0.3));
        const size = Math.sin($.tick.elapsedTime * 0.01) * 2 + 10;
        $.canvas.draw.circle(new Vector2(0, 0), size, Canvas.gradient.radial(new Vector2(0, 0), size, [[0, 'transparent'], [1, '#3333cc']]));
        $.canvas.restore();
    }
}