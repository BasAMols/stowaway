import { timeEaser } from "src/game/util/math/timeEaser";
import { CVE } from "../../util/canvas/cve";
import { Vector2 } from "../../util/math/vector2";

export class Stars extends CVE {
    stars: { position: Vector2, size: number }[] = [];
    static density: number = 0.0002;
    renderedSize: Vector2 = new Vector2(0, 0);
    constructor() {
        super();
        $.camera.addToZoomLayer(0, 'stars', this, 2);
    }

    addStars(position: Vector2, size: Vector2) {
        const area = size.x * size.y;
        for (let i = 0; i < area * Stars.density; i++) {
            this.stars.push({
                position: position.add(new Vector2(Math.random() * size.x, Math.random() * size.y)),
                size: Math.random() < 0.03 ? 2.5 : 0.5 + Math.random() * 1,
            });
        }
    }

    checkRenderSize() {
        if (this.renderedSize.x < $.container.x) {
            this.addStars(new Vector2(this.renderedSize.x, 0), new Vector2($.container.x - this.renderedSize.x, this.renderedSize.y));
            this.renderedSize.x = $.container.x;
        }
        if (this.renderedSize.y < $.container.y) {
            this.addStars(new Vector2(0, this.renderedSize.y), new Vector2(this.renderedSize.x, $.container.y - this.renderedSize.y));
            this.renderedSize.y = $.container.y;
        }
    }

    render() {

        this.opacity = timeEaser($.time, [
            [3, 1],
            [6, 0],
            [18, 0],
            [20, 1],
        ], 24);

        this.checkRenderSize();
        for (const star of this.stars) {
            $.canvas.draw.circle(star.position, star.size, 'white');
        }
    }
}