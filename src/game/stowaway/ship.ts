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
    static offset: Vector2 = new Vector2(250, -150);
    static shipScale: number = 2;

    constructor(url: string, parallax: number, private foreground: boolean = false, private roi: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 1920, height: 1289 }) {
        super();

        this.subCanvas = new SubCanvas(new Vector2(this.roi.width * ShipPart.shipScale, this.roi.height * ShipPart.shipScale));

        $.camera.addToZoomLayer(parallax, 'ship', this, 10);

        // void $.loader.loadImage('dist/spa/images/ship/animationDay/' + url).then((image) => {
        //     this.themes.push({
        //         timeData: [[8, 0], [11, 1], [14, 1], [17, 0]],
        //         image: image,
        //         opacity: 1,
        //     });
        // });
        // void $.loader.loadImage('dist/spa/images/ship/animationSunSet/' + url).then((image) => {
        //     this.themes.push({
        //         timeData: [[14, 0], [17, 1], [20, 0]],
        //         image: image,
        //         opacity: 1,
        //     });
        // });
        // console.log('day_' + url);

        // void $.loader.loadImage('dist/spa/images/ship/day_' + url).then((image) => {
        //     this.themes.push({
        //         timeData: [[5, 0], [8, 1], [17, 1], [20, 0]],
        //         image: image,
        //         opacity: 1,
        //     });
        //     // this.renderFirst(this.themes[0]!);
        // });
        void $.loader.loadImage('dist/spa/images/ship/night_' + url).then((image) => {
            this.themes.push({
                timeData: [[5, 1], [8, 0], [17, 0], [20, 1]],
                image: image,
                opacity: 1,
            });
            this.renderFirst(this.themes[0]!);
        });
        // void $.loader.loadImage('dist/spa/images/ship/animationSunRise/' + url).then((image) => {
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
        this.subCanvas.draw.image(theme.image, new Vector2(-this.roi.x * ShipPart.shipScale, -this.roi.y * ShipPart.shipScale), new Vector2(1920 * ShipPart.shipScale, 1289 * ShipPart.shipScale));
        this.subCanvas.restore();
    }
    renderSecond(theme: typeof this.themes[number]) {
        this.subCanvas.save();
        this.subCanvas.ctx.globalCompositeOperation = 'source-atop';
        this.subCanvas.ctx.globalAlpha = theme.opacity;
        this.subCanvas.draw.image(theme.image, new Vector2(0, 0), new Vector2(1920 * ShipPart.shipScale, 1289 * ShipPart.shipScale));
        this.subCanvas.restore();
    }
    lastRender: boolean;

    preTransform(): void {
        if (this.foreground) {
            this.lastRender = false;
            this.renderFirst(this.themes[0]!);
            $.areaManager.mask(this.subCanvas, new Vector2(-this.roi.x * ShipPart.shipScale, -this.roi.y * ShipPart.shipScale));
        }

        this.transform.setScale(1 / ShipPart.shipScale);
        this.transform.setPosition(ShipPart.offset);
    }
    render() {
        $.canvas.draw.canvas(this.subCanvas, new Vector2(this.roi.x * ShipPart.shipScale, this.roi.y * ShipPart.shipScale), 1);
    }
}