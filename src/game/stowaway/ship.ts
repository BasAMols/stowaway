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
    }[] = []
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
    }
    render() {
        $.canvas.draw.canvas(this.subCanvas, new Vector2(0, 0), 1);
    }
}
export class Ship extends CVE {
    shipImages: Record<string, HTMLImageElement> = {};
    open: number = 0;
    characterLayer: Character;
    getTargetPosition(): Vector2 {
        // return new Vector2(0, 0);
        const transform = Transform2d.calculateWorldTransform([this.children.character_Dave.transform, this.transform]);
        return transform.position;
    }
    constructor() {
        super();
        this.transform.setAnchor(new Vector2(500, 1200));
        this.transform.setPosition(new Vector2(0, 0));
        // this.characterLayer = new Character({ name: 'character' });

        new ShipPart('0000-min.png').add('ext', this, 1);
        new ShipPart('0001-min.png').add('back', this, 5);
        new ShipPart('0002-min.png').add('mid', this, 20);
        // this.characterLayer.add('character', this, 15);
        new ShipPart('0003-min.png').add('front', this, 40);

        Object.entries($.mapManager.locations).forEach(([key, location]) => {
            location.add('location_' + key, this, 100);
        });

        $.mapManager.mapConnections.forEach(connection => {
            connection.add('connection_' + connection.data.from + '_' + connection.data.to, this, 100);
        });

        $.peopleManager.people.forEach(person => {
            person.add('character_' + person.data.name, this, 115);
        });


    }

    preRender() {
        this.children.ext.opacity = 0;
        this.children.front.opacity = (1 - this.open);
    }

    render() {
        this.transform.setRotation(Math.sin($.tick.elapsedTime * 0.0006) * 1);
        this.transform.setPosition(new Vector2(Math.sin($.tick.elapsedTime * 0.0003) * 50, -200));
    }
}