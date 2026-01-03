import { timeEaser } from "src/game/util/math/timeEaser";
import { CVE } from "../../util/canvas/cve";
import { Vector2 } from "../../util/math/vector2";
import { Utils } from "src/game/util/math/util";

export class Wave extends CVE {
    lastRender: number = 0;
    constructor(private y: number, private height: number, private frequency: number, private colorDay: [number, number, number, number], private colorNight: [number, number, number, number], private speed: number = 0.0005, opacity: number = 1, private parallax: number = 1) {
        super();
        this.transform.setPosition(new Vector2(-1920 / 2, this.y));
        this.opacity = opacity;
        $.camera.addToZoomLayer(parallax, 'wave', this, 6);
    }

    preTransform(): void {
        if ($.values.zoom > 6 && this.parallax >= 1) {
            if (this.parallax >= 1.2) {
                this.opacity = 0;
            } else {
                this.opacity = 0.5;
            }
        } else {
            this.opacity = 1;
        }
    }

    render() {
        if (this.opacity === 0) {
            return;
        }
        if ($.tick.elapsedTime - this.lastRender > 200) {
            this.lastRender = $.tick.elapsedTime;
        }
        this.drawSine(3840 * 2, this.height, this.frequency, 1920, this.lastRender * this.speed, this.colorDay, this.colorNight, 20);
    }

    drawSine(totalWidth: number, waveHeight: number, frequency: number, totalHeight: number, offset: number, colorDay: [number, number, number, number], colorNight: [number, number, number, number], resolution: number = 1) {

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
        $.canvas.draw.polygonFill(polygon, Utils.stringToColor($.flags.night ? colorNight : colorDay));
    }
}

export class Ocean {
    constructor() {
        for (let i = 0; i < 25; i++) {
            ((key: string, offset: number) => {
                const colorOffset = $.flags.night ? (offset * 0.2 + 0.3) : (offset * 0.1 + 0.9);
                const colorDay = [130 * colorOffset, 160 * colorOffset, 200 * colorOffset, 1] as [number, number, number, number];
                const colorNight = [28 * colorOffset, 42 * colorOffset, 58 * colorOffset, 1] as [number, number, number, number];
                new Wave(790 + offset * 10 * 25, 4 * offset, 0, colorDay, colorNight, 0.0005, 1, offset);
            })('wave' + (i + 1), i * 0.05 - 0.02)
        }
    }
}