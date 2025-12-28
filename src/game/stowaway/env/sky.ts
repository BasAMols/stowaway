import { CVE } from "../../util/canvas/cve";
import { timeEaser } from "../../util/math/timeEaser";
import { Utils } from "../../util/math/util";
import { Vector2 } from "../../util/math/vector2";
import { Stars } from "./stars";

export class Sky extends CVE {
    constructor() {
        super();
        $.camera.addToZoomLayer(0, 'sky', this, 1);
    }

    render() {
        const color = Utils.easeColor((timeEaser($.time, [
            [5, 0],
            [8, 1],
            [16, 1],
            [19, 0],
        ], 24)), [173, 202, 251, 1], [10, 20, 30, 1]);

        $.canvas.draw.rect(new Vector2(0, 0), $.container, color);

        // this.background({
        //     color: color,
        // });
        // window.document.body.style.backgroundColor = color;
        // this.sun.setTime(time);
        // this.moon.setTime(time, day);
        // this.horizon.setTime(time);

    }
}