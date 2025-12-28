import { Canvas } from "src/game/util/canvas/canvas";
import { CVE } from "src/game/util/canvas/cve";
import { Vector2 } from "src/game/util/math/vector2";
import { TaskType, Task } from "./task";
import { Schedule } from "./schedule";
import { SubCanvas } from "src/game/util/canvas/subCanvas";
import { BaseCanvas } from "src/game/util/canvas/baseCanvas";

export class Test extends CVE {

    constructor() {
        super();
        $.camera.addToZoomLayer(1.5, 'test', this, 100);

    }

    preTransform(): void {
        if ($.mouse.worldSpace) {
            this.transform.setPosition($.camera.calculateWorldSpace($.mouse.screenSpace, 1.5));
        } else {
            this.transform.setPosition(new Vector2(0, 0));
        }
    }

    render() {
        $.canvas.draw.circle(new Vector2(0, 0), 3, $.mouse.down ? '#f00' : '#fff');
    }
}