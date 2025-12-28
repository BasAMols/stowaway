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
    constructor(url: string) {
        super();

        this.subCanvas = new SubCanvas(new Vector2(3840 * .5, 2800 * .5));

        void $.loader.loadImage('dist/spa/images/ship/animationDay/' + url).then((image) => {
            this.themes.push({
                timeData: [[8, 0], [11, 1], [14, 1], [17, 0]],
                image: image,
                opacity: 1,
            });
        });
        void $.loader.loadImage('dist/spa/images/ship/animationSunSet/' + url).then((image) => {
            this.themes.push({
                timeData: [[14, 0], [17, 1], [20, 0]],
                image: image,
                opacity: 1,
            });
        });
        void $.loader.loadImage('dist/spa/images/ship/animationNight/' + url).then((image) => {
            this.themes.push({
                timeData: [[5, 1], [8, 0], [17, 0], [20, 1]],
                image: image,
                opacity: 1,
            });
        });
        void $.loader.loadImage('dist/spa/images/ship/animationSunRise/' + url).then((image) => {
            this.themes.push({
                timeData: [[5, 0], [8, 1], [11, 0]],
                image: image,
                opacity: 1,
            });
        });

    }
    renderFirst(theme: typeof this.themes[number]) {
        this.subCanvas.ctx.globalCompositeOperation = 'source-over';
        this.subCanvas.ctx.globalAlpha = 1;
        this.subCanvas.draw.image(theme.image, new Vector2(0, 0), new Vector2(3840 * .5, 2800 * .5));
    }
    renderSecond(theme: typeof this.themes[number]) {
        this.subCanvas.ctx.globalCompositeOperation = 'source-atop';
        this.subCanvas.ctx.globalAlpha = theme.opacity;
        this.subCanvas.draw.image(theme.image, new Vector2(0, 0), new Vector2(3840 * .5, 2800 * .5));
    }
    preRender() {

        this.subCanvas.clear();
        this.themes.forEach(theme => {
            theme.opacity = timeEaser($.day % 1 * 24, theme.timeData, 24);
        });

        const sorted = this.themes.sort((a, b) => b.opacity - a.opacity);

        if (sorted[0]!.opacity >= 1) {
            this.renderFirst(sorted[0]!);
        } else {
            this.renderFirst(sorted[0]!);
            this.renderSecond(sorted[1]!);
        }

        if (this.mask) {
            this.subCanvas.mask.circle(this.mask.position, this.mask.size.x / 2);
        }
    }
    render() {
        $.canvas.draw.canvas(this.subCanvas, new Vector2(0, 0), 1);
    }
}
export class Ship2 extends CVE {
    shipImages: Record<string, HTMLImageElement> = {};
    ext: ShipPart;
    constructor(position: Vector2, scale: number) {
        super();

        this.ext = new ShipPart('0000-min.png');

        this.transform.setPosition(position);
        this.transform.setScale(scale);

        this.ext.add('ext', this, 1);
    }
}