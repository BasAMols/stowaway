import { timeEaser } from "src/game/util/math/timeEaser";
import { CVE } from "../../util/canvas/cve";
import { Vector2 } from "../../util/math/vector2";
import { Utils } from "src/game/util/math/util";

export class Wave extends CVE {
    lastRender: number = 0;
    constructor(private y: number, private height: number, private frequency: number, private colorA: [number, number, number, number], private colorB: [number, number, number, number], private speed: number = 0.0005, opacity: number = 1) {
        super();
        this.transform.setPosition(new Vector2(-1920 / 2, this.y));
        this.opacity = opacity;
    }

    render() {
        if ($.tick.elapsedTime - this.lastRender > 200) {
            this.lastRender = $.tick.elapsedTime;
        }
        this.drawSine(3840 * 2, this.height, this.frequency, 1920, this.lastRender * this.speed, this.colorA, this.colorB, 70);
    }

    drawSine(totalWidth: number, waveHeight: number, frequency: number, totalHeight: number, offset: number, colorA: [number, number, number, number], colorB: [number, number, number, number], resolution: number = 1) {


        const color = Utils.easeColor(timeEaser($.day % 1 * 24, [
            [5, 1],
            [7, 0],
            [16, 0],
            [18, 1],
        ], 24), colorA, colorB);

        const waveWidthBase = 1920;
        const polygon: Vector2[] = [];

        for (let i = 0; i < totalWidth; i += resolution) { // Loop from left side to current x
            const y = waveHeight - waveHeight * Math.sin(i * 2 * Math.PI * (frequency / waveWidthBase) + offset); // Calculate y value from x
            polygon.push(new Vector2(i, y)); // Where to draw to
        }

        // square off the wave
        polygon.push(new Vector2(totalWidth, waveHeight - waveHeight * Math.sin(totalWidth * 2 * Math.PI * (frequency / waveWidthBase) + offset))); // Where to draw to
        polygon.push(new Vector2(totalWidth, totalHeight)); // Where to draw to
        polygon.push(new Vector2(0, totalHeight)); // Where to draw to
        $.canvas.draw.polygonFill(polygon, color);
    }
}