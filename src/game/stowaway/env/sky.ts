import { CVE } from "../../util/canvas/cve";
import { timeEaser } from "../../util/math/timeEaser";
import { Utils } from "../../util/math/util";
import { Vector2 } from "../../util/math/vector2";
import { Moon } from "./moon";
import { Stars } from "./stars";
import { Sun } from "./sun";

export class Sky extends CVE {
    overlays: {
        element: CVE;
        order: number;
        name: string;
    }[] = [];
    constructor() {
        super();
        // this.sun = new Sun(this.managers);
        // this.moon = new Moon(this, this.managers);
        // this.horizon = new Horizon(this.managers);

        new Stars().add('stars', this);
        const sun = new Sun().add('sun', this, 2) as Sun;
        this.overlays.push(...sun.overlay);
        const moon = new Moon().add('moon', this, 3) as Moon;
        this.overlays.push(...moon.overlay);
    }

    render() {
        const color = Utils.easeColor((timeEaser(($.day % 1) * 24, [
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