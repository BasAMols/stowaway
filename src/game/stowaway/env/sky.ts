import { CVE } from "../../util/canvas/cve";
import { timeEaser } from "../../util/math/timeEaser";
import { Utils } from "../../util/math/util";
import { Vector2 } from "../../util/math/vector2";

export class Sky extends CVE {
    daySkyImage: HTMLImageElement;
    nightSkyImage: HTMLImageElement;
    constructor() {
        super();
        $.camera.addToZoomLayer(0.0, 'sky', this, 1);
        void $.loader.loadImage('dist/spa/images/nightSky.jpg').then((image) => {
            this.nightSkyImage = image;
        });
        void $.loader.loadImage('dist/spa/images/daySky.jpg').then((image) => {
            this.daySkyImage = image;
        });
    }

    render() {
        if ($.flags.night) {
            $.canvas.draw.image(this.nightSkyImage, new Vector2(-1500, -0), new Vector2(10000 / 2, 2160 / 2));
        } else {
            $.canvas.draw.image(this.daySkyImage, new Vector2(-1500, -0), new Vector2(10000 / 2, 2160 / 2));
        }

    }
}