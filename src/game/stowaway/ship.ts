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
    shipScale: number = 2;

    constructor(url: string, parallax: number, private foreground: boolean = false) {
        super();

        this.subCanvas = new SubCanvas(new Vector2(1920 * this.shipScale, 1289 * this.shipScale));

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
        this.subCanvas.ctx.globalCompositeOperation = 'source-over';
        this.subCanvas.ctx.globalAlpha = 1;
        this.subCanvas.draw.image(theme.image, new Vector2(0, 0), new Vector2(1920 * this.shipScale, 1289 * this.shipScale));
    }
    renderSecond(theme: typeof this.themes[number]) {
        this.subCanvas.ctx.globalCompositeOperation = 'source-atop';
        this.subCanvas.ctx.globalAlpha = theme.opacity;
        this.subCanvas.draw.image(theme.image, new Vector2(0, 0), new Vector2(1920 * this.shipScale, 1289 * this.shipScale));
    }
    preTransform(): void {
        if (this.foreground) {
            this.opacity = $.flags.open ? 0 : 1;
        }

        this.transform.setAnchor(new Vector2(500, 1200));
        this.transform.setScale(1 / this.shipScale);
        // this.transform.setRotation(Math.sin($.tick.elapsedTime * 0.0006) * 0.2 * ($.flags.debug ? 0 : 1));
        this.transform.setPosition(new Vector2(Math.sin($.tick.elapsedTime * 0.0003) * 10 * ($.flags.debug ? 0 : 0), -750));
    }
    preRender() {
        return
        if ($.flags.open && this.foreground) {
            return
        }

        this.subCanvas.clear();
        this.themes.forEach(theme => {
            theme.opacity = timeEaser($.day % 1 * 24, theme.timeData, 24);
        });

        const sorted = this.themes.sort((a, b) => b.opacity - a.opacity);

        this.renderFirst(sorted[0]!);
        // if (sorted[0]!.opacity >= 1) {
        // } else {
        //     this.renderFirst(sorted[0]!);
        //     this.renderSecond(sorted[1]!);
        // }

        // if (this.mask) {
        //     this.subCanvas.mask.circle(this.mask.position, this.mask.size.x / 2);
        // }

        // this.renderFirst(sorted[0]!);
    }
    render() {
        $.canvas.draw.canvas(this.subCanvas, new Vector2(0, 0), 1);
    }
}