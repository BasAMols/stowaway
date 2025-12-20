import { CVE } from "../../util/canvas/cve";
import { Vector2 } from "../../util/math/vector2";

export class Wave extends CVE {
    constructor(private position: Vector2, private height: number, private frequency: number, private color: string, private speed: number = 0.0005) {
        super();
        this.transform.setPosition(this.position);
    }

    render() {
        this.drawSine($.canvas.cvs.width, this.height, this.frequency, $.canvas.cvs.height, $.tick.elapsedTime * this.speed, this.color, 70);
    }

    drawSine(totalWidth: number, waveHeight: number, frequency: number, totalHeight: number, offset: number, color: string, resolution: number = 1) {

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