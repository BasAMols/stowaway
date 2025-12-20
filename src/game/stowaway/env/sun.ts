import { Canvas } from "src/game/util/canvas/canvas";
import { CQuick } from "src/game/util/canvas/cr";
import { CVE } from "src/game/util/canvas/cve";
import { timeEaser } from "src/game/util/math/timeEaser";
import { Vector2 } from "src/game/util/math/vector2";

export class Sun extends CVE {
    overlay: {
        element: CVE;
        order: number;
        name: string;
    }[] = [];
    constructor() {
        super();
        this.overlay.push({
            element: new CQuick({
                onRender: (that) => {
                    that.transform.setPosition(this.transform.position);
                    that.transform.setRotation(this.transform.rotation);
                    that.transform.setAnchor(this.transform.anchor);
                    $.canvas.draw.circle(new Vector2(0, 0), 1800, Canvas.gradient.radial(new Vector2(0, 0), 1800, [[0.00, '#ffff0055'], [1, '#ffff0000']]));
                    that.opacity = timeEaser(($.day % 1) * 24, [
                        [4, 0],
                        [7, 1],
                        [18, 1],
                        [19, 0],
                    ], 24);
                }
            }),
            order: 150,
            name: 'sunOverlay'
        });
    }

    render() {
        this.transform.setPosition(new Vector2(10, $.container.y / 2));
        this.transform.setRotation($.day * 360 + 270);
        this.transform.setAnchor(new Vector2($.container.x / 2 - 20, 50));

        $.canvas.draw.circle(new Vector2(0, 0), 1400, Canvas.gradient.radial(new Vector2(0, 0), 1400, [[0, '#ffff00ff'], [0.04, '#ffff00ff'], [0.05, '#ffff0000']]));
    }
}