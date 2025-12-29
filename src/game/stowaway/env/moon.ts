import { Canvas } from "src/game/util/canvas/canvas";
import { CQuick } from "src/game/util/canvas/cr";
import { CVE } from "src/game/util/canvas/cve";
import { timeEaser } from "src/game/util/math/timeEaser";
import { Vector2 } from "src/game/util/math/vector2";

export class Moon extends CVE {
    constructor() {
        super();

        const depth = 0.95;
        $.camera.addToZoomLayer(depth, 'moonOverlay', new CQuick({
            onRender: (that) => {
                const p = $.camera.calculateWorldSpace(new Vector2(410, 200), depth);
                const s = 1 / $.values.zoom;
                $.canvas.draw.circle(p, 1000, Canvas.gradient.radial(p, 200 * s, [[0.00, '#ffffff22'], [1, '#ffffff00']]));
                $.canvas.draw.circle(p, 3000, Canvas.gradient.radial(p, 1000 * s, [[0.00, '#ffffff11'], [1, '#ffffff00']]));
                that.opacity = timeEaser(($.day % 1) * 24, [
                    [6, 1],
                    [9, 0],
                    [17, 0],
                    [19, 1],
                ], 24);
            }
        }), 151);

    }

    render() {
        this.transform.setPosition(new Vector2(10, $.container.y / 2));
        this.transform.setRotation($.day * 360 + 90);
        this.transform.setAnchor(new Vector2($.container.x / 2 - 20, 50));

        $.canvas.draw.circle(new Vector2(0, 0), 1600, Canvas.gradient.radial(new Vector2(0, 0), 1600, [[0, '#ffffffff'], [0.04, '#ffffffff'], [0.04, '#ffffff00']]));
    }
}