import { CVE } from "../../util/canvas/cve";
import { timeEaser } from "../../util/math/timeEaser";
import { Utils } from "../../util/math/util";
import { Vector2 } from "../../util/math/vector2";
import { Stars } from "./stars";

export class Sky extends CVE {
    constructor() {
        super();
        // this.sun = new Sun(this.managers);
        // this.moon = new Moon(this, this.managers);
        // this.horizon = new Horizon(this.managers);

        new Stars().add('stars', this);
    }

    render() {
        const color = Utils.easeColor((timeEaser(0, [
            [5, 0],
            [9, 1],
            [15, 1],
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

        // this.stars.style(`opacity: ${timeEaser(time % 24, [
        //     [6, 1],
        //     [7, 0],
        //     [18, 0],
        //     [19, 1],
        // ], 24)};`);
    }
}