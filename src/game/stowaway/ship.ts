import { CVE } from "../util/canvas/cve";
import { Vector2 } from "../util/math/vector2";

export class Ship extends CVE {
    constructor() {
        super();
        this.transform.setAnchor(new Vector2(300, 250));
    }

    render() {
        this.transform.setRotation(Math.sin($.tick.elapsedTime * 0.0005) * 4);
        this.transform.setPosition(new Vector2(200, 470 + Math.sin($.tick.elapsedTime * 0.0005) * 20));
        $.canvas.draw.rect(new Vector2(0, 0), new Vector2(600, 300), 'brown');
    }

}