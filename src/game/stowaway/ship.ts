import { CVE } from "../util/canvas/cve";
import { SubCanvas } from "../util/canvas/subCanvas";
import { timeEaser } from "../util/math/timeEaser";
import { Transform2d } from "../util/math/transform";
import { Vector2 } from "../util/math/vector2";
import { Character } from "./characters/character";

export class ShipPart extends CVE {
    subCanvas: SubCanvas;
    themes: {
        timeData: [number, number][];
        image: HTMLImageElement;
        opacity: number;
    }[] = [];
    mask: {
        position: Vector2;
        size: Vector2;
        opacity: number;
    }
    static offset: Vector2 = new Vector2(250, -100);
    static shipScale: number = 1;
    lastTheme: number = 0;

    constructor(url: string, parallax: number, private foreground: boolean = false, private roi: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 1783, height: 1541 }) {
        super();

        this.subCanvas = new SubCanvas(new Vector2(this.roi.width * ShipPart.shipScale, this.roi.height * ShipPart.shipScale));

        $.camera.addToZoomLayer(parallax, 'ship', this, 10);

        // void $.loader.loadImage('src/assets/ship/animationDay/' + url).then((image) => {
        //     this.themes.push({
        //         timeData: [[8, 0], [11, 1], [14, 1], [17, 0]],
        //         image: image,
        //         opacity: 1,
        //     });
        // });
        // void $.loader.loadImage('src/assets/ship/animationSunSet/' + url).then((image) => {
        //     this.themes.push({
        //         timeData: [[14, 0], [17, 1], [20, 0]],
        //         image: image,
        //         opacity: 1,
        //     });
        // });
        // console.log('day_' + url);

        void $.loader.loadImage('src/assets/ship/day_' + url).then((image) => {
            this.themes.push({
                timeData: [[5, 0], [8, 1], [17, 1], [20, 0]],
                image: image,
                opacity: 1,
            });
            // this.renderFirst(this.themes[0]!);
        });
        void $.loader.loadImage('src/assets/ship/night_' + url).then((image) => {
            this.themes.push({
                timeData: [[5, 1], [8, 0], [17, 0], [20, 1]],
                image: image,
                opacity: 1,
            });
            this.renderFirst(this.themes[0]!);
        });
        // void $.loader.loadImage('src/assets/ship/animationSunRise/' + url).then((image) => {
        //     this.themes.push({
        //         timeData: [[5, 0], [8, 1], [11, 0]],
        //         image: image,
        //         opacity: 1,
        //     });
        // });

    }
    renderFirst(theme: typeof this.themes[number]) {
        this.subCanvas.save();
        this.subCanvas.ctx.globalCompositeOperation = 'source-over';
        this.subCanvas.ctx.globalAlpha = 1;
        this.subCanvas.draw.image(theme.image, new Vector2(-this.roi.x * ShipPart.shipScale, -this.roi.y * ShipPart.shipScale), new Vector2(1783 * ShipPart.shipScale, 1541 * ShipPart.shipScale));
        this.subCanvas.restore();
    }
    renderSecond(theme: typeof this.themes[number]) {
        this.subCanvas.save();
        this.subCanvas.ctx.globalCompositeOperation = 'source-atop';
        this.subCanvas.ctx.globalAlpha = theme.opacity;
        this.subCanvas.draw.image(theme.image, new Vector2(0, 0), new Vector2(1783 * ShipPart.shipScale, 1541 * ShipPart.shipScale));
        this.subCanvas.restore();
    }

    preTransform(): void {
        const themeIndex = this.themes.findIndex(theme => theme.timeData[0][1] === ($.flags.night ? 1 : 0));

        if (themeIndex !== this.lastTheme && !this.foreground) {
            this.renderFirst(this.themes[themeIndex]!);
        } else if (this.foreground) {
            this.renderFirst(this.themes[themeIndex]!);
            if ($.flags.open || $.flags.openAll) {
                $.areaManager.mask(this.subCanvas, new Vector2(-this.roi.x * ShipPart.shipScale, -this.roi.y * ShipPart.shipScale));
            }
        }
        this.lastTheme = themeIndex;

        this.transform.setScale(1 / ShipPart.shipScale);
        this.transform.setPosition(ShipPart.offset);

    }
    render() {
        $.canvas.draw.canvas(this.subCanvas, new Vector2(this.roi.x * ShipPart.shipScale, this.roi.y * ShipPart.shipScale), 1);
    }
}

export class Ship {
    constructor() {
        for (let i = 0; i < 7; i++) {
            const o = 0.97 + i * 0.015;
            new ShipPart(
                i.toString().padStart(4, '0') + '.png', o,
                (o) > 1.03,
                { x: 0, y: 800, width: 1783, height: 1541 - 800 }
            )
            new ShipPart(
                i.toString().padStart(4, '0') + '.png', o + 0.0001,
                false,
                { x: 0, y: 0, width: 1783, height: 800 }
            );
        }
    }
}