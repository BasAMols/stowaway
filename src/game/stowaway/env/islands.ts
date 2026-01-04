import { LayerAsset } from "src/game/util/layerAsset";
import { Vector2 } from "src/game/util/math/vector2";

export class Islands {
    constructor() {
        new LayerAsset({
            url: `src/assets/island/islandNight_`, key: 'islandNight', fromIndex: 0, toIndex: 2, extention: '.png', position: new Vector2(2100, 850), originalSize: new Vector2(6787, 1933), scale: 0.2, drawScale: 0.15, depth: 0.1, increment: 0.015,
            preTransform: (that) => {
                that.opacity = $.flags.night ? 1 : 0;
                const t = ($.tick.elapsedTime % 100000) / 100000;
                that.transform.setPosition(new Vector2(300 - t * 4500, 0));
            }
        });
        new LayerAsset({
            url: `src/assets/island/islandDay_`, key: 'islandDay', fromIndex: 0, toIndex: 2, extention: '.png', position: new Vector2(2100, 850), originalSize: new Vector2(6787, 1933), scale: 0.2, drawScale: 0.15, depth: 0.1, increment: 0.015,
            preTransform: (that) => {
                that.opacity = $.flags.night ? 0 : 1;
                const t = ($.tick.elapsedTime % 100000) / 100000;
                that.transform.setPosition(new Vector2(300 - t * 4500, 0));
            }
        });
        // new LayerAsset({
        //     url: `src/assets/island/island${$.flags.night ? 'Night' : 'Day'}_`, key: 'island2', fromIndex: 0, toIndex: 2, extention: '.png', position: new Vector2(-1900, -330), originalSize: new Vector2(6787, 1933), scale: 1, drawScale: 0.75, depth: 0.6, increment: 0.3,
        //     preTransform: (that) => {
        //         const t = ($.tick.elapsedTime % 60000) / 60000;
        //         that.transform.setPosition(new Vector2(4000 - t * 8000, 0));
        //     }
        // });
        // new Test();
    }
}